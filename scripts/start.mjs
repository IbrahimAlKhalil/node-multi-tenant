#!/usr/bin/env node

import cliProgress from 'cli-progress';
import { fileURLToPath } from 'url';
import Docker from 'dockerode';
import path, { dirname } from 'path';
import { execa } from 'execa';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docker = new Docker(
  process.platform === 'win32'
    ? 'tcp://127.0.0.1:2375'
    : '/var/run/docker.sock',
);
const prefix = 'qmmsoft';
const images = {
  postgres: 'postgis/postgis:14-3.2-alpine',
  minio: 'minio/minio:RELEASE.2022-02-18T01-50-10Z',
  redis: 'eqalpha/keydb:alpine_x86_64_v6.2.2',
};
const containerNames = {
  postgres: `${prefix}-postgres`,
  minio: `${prefix}-minio`,
  redis: `${prefix}-redis`,
};

async function removeContainer(name) {
  console.log(chalk.whiteBright.bold('Removing container:'), chalk.cyan(name));

  try {
    const postgres = docker.getContainer(name);
    await postgres.stop();
  } catch (e) {
    //
  }

  try {
    const postgres = docker.getContainer(name);
    await postgres.remove();
  } catch (e) {
    //
  }
}

function pullImage(tag) {
  return new Promise(async (resolve) => {
    console.log(chalk.whiteBright.bold('Pulling image:'), chalk.cyan(tag));

    const bar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic,
    );

    bar.start();

    function onProgress(event) {
      const { progressDetail } = event;

      // Update progressbar
      if (progressDetail) {
        bar.setTotal(progressDetail.total);
        bar.update(progressDetail.current);
      }
    }

    function onFinish() {
      bar.stop();
      resolve();
      console.log(chalk.greenBright.bold('Done ✓'));
    }

    await docker.pull(tag, (error, stream) => {
      docker.modem.followProgress(stream, onFinish, onProgress);
    });
  });
}

async function pullImages() {
  const required = [];
  const availableImages = (await docker.listImages())
    .filter((image) => image.RepoTags)
    .map((image) => image.RepoTags[0]);

  for (const k in images) {
    required.push(images[k]);
  }

  // Pull images if not available
  for (const [index, value] of required.entries()) {
    if (availableImages.includes(value)) {
      if (index + 1 === required.length) {
        return;
      }

      continue;
    }

    await pullImage(value);
  }
}

function logContainer(container, prefix) {
  // Get a random color in hex
  const color = Math.floor(Math.random() * 16777215).toString(16);

  container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    details: true,
  }, (err, stream) => {
    stream.on('data', (data) => {
      let line = data.toString().trim();

      // Remove /u0000 and /u0001 characters
      line = line.replace(/[\u0000-\u001f]/g, '');

      // Don't print if the line is empty
      if (line.length === 0) {
        return;
      }

      // Remove first char from line
      line = line.substring(1);

      // Print the line
      console.log(
        chalk.hex(color).bold(`[${prefix}]`),
        line,
      );
    });
  });
}

function logProcess(_process, prefix) {
  const color = Math.floor(Math.random() * 16777215).toString(16);

  // Add prefix [API] to each line of stdout and stderr to make it easier to distinguish

  const handle = (data) => {
    const lines = data.toString().split('\n');

    while (lines.length > 1) {
      const line = lines.shift();

      // Don't print if line is empty
      if (line.length === 0) {
        continue;
      }

      console.log(chalk.hex(color).bold(`[${prefix}]`), line.trim());
    }
  };

  _process.stdout.on('data', handle);
  _process.stderr.on('data', handle);
}

async function startPostgres() {
  console.log(chalk.greenBright.bold('Starting Postgres...'));

  console.log(chalk.whiteBright.bold('Creating volume:'), chalk.cyan(containerNames.postgres));

  try {
    await docker.createVolume({
      Name: containerNames.postgres,
    });
  } catch (e) {
    console.log(chalk.redBright.bold(`Volume ${containerNames.postgres} already exists`));
  }

  console.log(chalk.whiteBright.bold('Creating container:'), chalk.cyan(containerNames.postgres));

  const postgres = await docker.createContainer({
    name: containerNames.postgres,
    Image: images.postgres,
    Env: [
      `POSTGRES_DB=${process.env.WEBSITE_POSTGRES_DATABASE}`,
      `POSTGRES_USER=${process.env.POSTGRES_USER}`,
      `POSTGRES_PASSWORD=${process.env.POSTGRES_PASSWORD}`,
    ],
    Hostname: containerNames.postgres,
    HostConfig: {
      PortBindings: {
        '5432/tcp': [
          {
            HostIp: '127.0.0.1',
            HostPort: `${process.env.POSTGRES_PORT}/tcp`,
          },
        ],
        '5432/udp': [
          {
            HostIp: '127.0.0.1',
            HostPort: `${process.env.POSTGRES_PORT}/udp`,
          },
        ],
      },
      RestartPolicy: {
        Name: 'on-failure',
      },
      Binds: [`${containerNames.postgres}:/var/lib/postgresql/data`],
    },
  });

  await docker.getNetwork(prefix).connect({
    Container: postgres.id,
  });

  await postgres.start();

  console.log(chalk.blueBright.bold('Waiting for Postgres to start...'));

  // Log the container logs
  logContainer(postgres, 'Postgres');

  // Wait for postgres to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log(chalk.greenBright.bold('Postgres started ✓'));
}

async function startMinio() {
  console.log(chalk.greenBright.bold('Starting Minio...'));

  console.log(chalk.whiteBright.bold('Creating volume:'), chalk.cyan(containerNames.minio));

  try {
    await docker.createVolume({
      Name: containerNames.minio,
    });
  } catch (e) {
    console.log(chalk.redBright.bold(`Volume ${containerNames.minio} already exists`));
  }

  console.log(chalk.whiteBright.bold('Creating container:'), chalk.cyan(containerNames.minio));

  const minio = await docker.createContainer({
    name: containerNames.minio,
    Image: images.minio,
    Hostname: containerNames.minio,
    Cmd: ['server', '/data'],
    Env: [
      `MINIO_ROOT_USER=${process.env.MINIO_ROOT_USER}`,
      `MINIO_ROOT_PASSWORD=${process.env.MINIO_ROOT_PASSWORD}`,
      `MINIO_PORT=${process.env.MINIO_PORT}`,
    ],
    HostConfig: {
      PortBindings: {
        '9000/tcp': [
          {
            HostIp: '127.0.0.1',
            HostPort: `${process.env.MINIO_PORT}/tcp`,
          },
        ],
        '9000/udp': [
          {
            HostIp: '127.0.0.1',
            HostPort: `${process.env.MINIO_PORT}/udp`,
          },
        ],
      },
    },
    RestartPolicy: {
      Name: 'on-failure',
    },
    Binds: [`${containerNames.minio}:/data`],
  });

  await minio.start();

  console.log(chalk.blueBright.bold('Waiting for Minio to start...'));

  // Log the container logs
  logContainer(minio, 'Minio');

  // Wait for minio to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(chalk.greenBright.bold('Minio started ✓'));
}

async function startRedis() {
  console.log(chalk.greenBright.bold('Starting Redis...'));

  // Create volume for redis
  console.log(chalk.whiteBright.bold('Creating volume:'), chalk.cyan(containerNames.redis));

  try {
    await docker.createVolume({
      name: `${prefix}-redis`,
    });
  } catch (e) {
    //
  }

  // Create redis container
  const redis = await docker.createContainer({
    name: containerNames.redis,
    Image: images.redis,
    Hostname: containerNames.redis,
    HostConfig: {
      PortBindings: {
        '6379/tcp': [
          {
            HostIp: '127.0.0.1',
            HostPort: `${process.env.REDIS_PORT}/tcp`,
          },
        ],
        '6379/udp': [
          {
            HostIp: '127.0.0.1',
            HostPort: `${process.env.REDIS_PORT}/udp`,
          },
        ],
      },
      RestartPolicy: {
        Name: 'on-failure',
      },
      Binds: [`${containerNames.redis}:/data`],
    },
  });

  await redis.start();

  console.log(chalk.blueBright.bold('Waiting for Redis to start...'));

  // Log the container logs
  logContainer(redis, 'Redis');

  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(chalk.greenBright.bold('Redis started ✓'));
}

async function startAPI() {
  console.log(chalk.greenBright.bold('Starting API...'));

  const nestPath = path.join(__dirname, '../api/node_modules/@nestjs/cli/bin/nest.js');

  const _process = execa('node', [nestPath, 'start', '--debug', process.env.API_DEBUG_PORT, '--watch'], {
    cwd: path.join(__dirname, '../api'),
    stdio: 'pipe',
    env: {
      ...process.env,
      FORCE_COLOR: true,
    },
  });

  logProcess(_process, 'API');

  console.log(chalk.greenBright.bold('API started ✓'));
}

async function startWeb() {
  console.log(chalk.greenBright.bold('Starting Web...'));

  const vitePath = path.join(__dirname, '../web/node_modules/vite/bin/vite.js');

  const _process = execa('node', [vitePath, '--port', process.env.WEB_PORT], {
    stdio: 'pipe',
    shell: true,
    cwd: path.join(__dirname, '../web'),
    env: {
      ...process.env,
      FORCE_COLOR: true,
    },
  });

  logProcess(_process, 'Web');

  console.log(chalk.greenBright.bold('Web started ✓'));
}

async function startWebsite() {
  console.log(chalk.greenBright.bold('Starting Website...'));

  const tsNodePath = path.join(__dirname, '../website/node_modules/.bin/ts-node-dev');

  const _process = execa(tsNodePath, ['--respawn', '--watch', `--inspect=127.0.0.1:${process.env.WEBSITE_DEBUG_PORT}`, '--', './server'], {
    cwd: path.join(__dirname, '../website'),
    stdio: 'pipe',
    env: {
      ...process.env,
      FORCE_COLOR: true,
    },
  });

  logProcess(_process, 'Website');

  console.log(chalk.greenBright.bold('Website started ✓'));
}

async function stop() {
  console.log(chalk.redBright.bold('Stopping...'));
  await removeContainer(containerNames.postgres);
  await removeContainer(containerNames.redis);
  await removeContainer(containerNames.minio);

  try {
    await docker.getNetwork(prefix).remove();
  } catch (e) {
    //
  }

  console.log(chalk.redBright.bold('Stopped ✓'));
}

async function close() {
  // Stop all the services
  await stop();

  // Finally exit
  process.exit();
}

export async function start(postgres, minio, redis, api, web, website) {
  process.stdin.resume();
  process.on('exit', close);
  process.on('SIGINT', close);
  process.on('SIGUSR1', close);
  process.on('SIGUSR2', close);
  process.on('uncaughtException', close);

  await pullImages();
  await stop();

  console.log(chalk.whiteBright.bold('Creating network:'), chalk.cyan(prefix));

  await docker.createNetwork({
    Name: prefix,
    checkDuplicate: true,
  });

  if (postgres) {
    await startPostgres();
  }

  if (minio) {
    await startMinio();
  }

  if (redis) {
    await startRedis();
  }

  if (api) {
    await startAPI();
  }

  if (web) {
    await startWeb();
  }

  if (website) {
    await startWebsite();
  }

  if (!postgres && !minio && !redis && !api && !web && !website) {
    await startPostgres();
    await startMinio();
    await startRedis();
    await startAPI();
    await startWeb();
    await startWebsite();
  }

  console.log(chalk.greenBright.bold('All services started ✓'));
}
