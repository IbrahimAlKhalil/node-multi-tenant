#!/usr/bin/env node

import { directusSnapshot } from './scripts/directus-snapshot.mjs';
import { directusRestore } from './scripts/directus-restore.mjs';
import { bootstrap } from './scripts/directus-bootstrap.mjs';
import { Command, program } from 'commander';
import { build } from './scripts/build.mjs';
import { start } from './scripts/start.mjs';
import { execa, execaSync } from 'execa';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import chalk from 'chalk';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the package.json file
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), { encoding: 'utf-8' }));

function getEnv(key, prefix = '') {
  // Get the environment variable
  const env = process.env[`${prefix}${key}`];

  // If prefix is an empty string the environment variable must exist
  if (prefix === '' && !env) {
    console.error(chalk.red(`Environment variable ${key} is not set`));
    process.exit(1);
  }

  // If environment variable is not set, use the default value
  if (!env) {
    return process.env[`${key}`];
  }

  // Return the environment variable
  return env;
}

function runInsideProjects(binPath, projectsToUse, env, extraArgs, excludedArgs = []) {
  const args = process.argv.slice(3).filter(arg => !excludedArgs.includes(arg));

  for (const projectToUse of projectsToUse) {
    // Execute the binary inside the project
    execaSync(typeof binPath === 'function' ? binPath(projectToUse) : binPath, args.concat(extraArgs), {
      stdio: 'inherit',
      shell: true,
      cwd: path.resolve(__dirname, `./${projectToUse}`),
      env: {
        ...process.env,
        ...(typeof env === 'function' ? env(projectToUse) : env),
      },
    });
  }
}

// Create the command line interface
program
  .version(packageJson.version)
  .name('qm');


// Create the dev command
// This command starts all the required services, such as the database, the API, and the clients
// If no arguments are provided, it starts all services

program.addCommand(
  new Command('dev')
    .option('-p, --postgres', 'Start Postgres')
    .option('-m, --minio', 'Start Minio')
    .option('-r, --redis', 'Start Redis')
    .option('-a, --api', 'Start API')
    .option('-w, --web', 'Start Web Client')
    .option('-W, --website', 'Start Website')
    .option('-e, --extensions', 'Watch directus extensions')
    .action((_, p) => start(
      p.getOptionValue('postgres'),
      p.getOptionValue('minio'),
      p.getOptionValue('redis'),
      p.getOptionValue('api'),
      p.getOptionValue('web'),
      p.getOptionValue('extensions'),
      p.getOptionValue('website'),
    ).catch(console.error)),
  {
    isDefault: true,
  },
);

// Create the build command
// This command is only for development environments
if (process.env.NODE_ENV === 'development') {
  program.addCommand(
    new Command('build')
      .option('-a, --api', 'Build API')
      .option('-w, --web', 'Build Web Client')
      .option('-W, --website', 'Build Website')
      .option('-p, --pack', 'Package artifacts for deployment')
      .action((_, p) => build(
        p.getOptionValue('api'),
        p.getOptionValue('web'),
        p.getOptionValue('website'),
        p.getOptionValue('pack'),
      )),
  );
}


// Create a wrapper for prisma CLI
const prisma = new Command('prisma');
prisma.action((_, _program) => {
  runInsideProjects(
    (project) => path.resolve(__dirname, `./${project}/node_modules/.bin/prisma`),
    ['api', 'website'],
    (project) => {
      const prefix = project === 'api' ? '' : 'WEBSITE_';

      return {
        ...process.env,
        DATABASE_URL: `postgres://${getEnv('POSTGRES_USER', prefix)}:${getEnv('POSTGRES_PASSWORD', prefix)}@${getEnv('POSTGRES_HOST', prefix)}:${getEnv('POSTGRES_PORT', prefix)}/${getEnv('POSTGRES_DATABASE', prefix)}`,
      };
    },
  );
});
['W', 'a'].forEach(cmd => {
  const prefix = cmd === 'W' ? 'WEBSITE_' : '';
  const project = cmd === 'W' ? 'website' : 'api';

  prisma.addCommand(
    new Command(cmd)
      .description(`Run prisma in the ${project} app`)
      .option('-h, --help', 'Output usage information')
      .action((_, _program) => {
        runInsideProjects(
          path.resolve(__dirname, `./${project}/node_modules/.bin/prisma`),
          [project],
          {
            ...process.env,
            DATABASE_URL: `postgres://${getEnv('POSTGRES_USER', prefix)}:${getEnv('POSTGRES_PASSWORD', prefix)}@${getEnv('POSTGRES_HOST', prefix)}:${getEnv('POSTGRES_PORT', prefix)}/${getEnv('POSTGRES_DATABASE', prefix)}`,
          },
          [],
          ['W', 'a'],
        );
      }),
  );
});

// Create a wrapper for NestJS CLI
const nest = new Command('nest');
nest.action((_, _program) => {
  runInsideProjects(
    (project) => path.resolve(__dirname, `./${project}/node_modules/.bin/nest`),
    ['api'],
  );
});
['a'].forEach(cmd => {
  const project = 'api';

  nest.addCommand(
    new Command(cmd)
      .description(`Run nest in the ${project} app`)
      .option('-h, --help', 'Output usage information')
      .action((_, _program) => {
        runInsideProjects(
          path.resolve(__dirname, `./${project}/node_modules/.bin/nest`),
          [project],
          process.env,
          [],
          ['a'],
        );
      }),
  );
});

// Create a command which runs pnpm lint on all projects
const lint = new Command('lint');
lint.action((_, _program) => {
  runInsideProjects(
    'pnpm lint',
    ['api', 'website', 'web'],
  );
});
['W', 'a', 'w'].forEach(cmd => {
  const project = cmd === 'W' ? 'website' : cmd === 'a' ? 'api' : 'web';

  lint.addCommand(
    new Command(cmd)
      .description(`Run lint in the ${project} app`)
      .option('-h, --help', 'Output usage information')
      .action((_, _program) => {
        runInsideProjects(
          'pnpm lint',
          [project],
          process.env,
          [],
          ['W', 'a', 'w'],
        );
      }),
  );
});

// Create a command which runs pnpm test on all projects
const test = new Command('test');
['W', 'a', 'w'].forEach(cmd => {
  const project = cmd === 'W' ? 'website' : cmd === 'a' ? 'api' : 'web';
  const testTypes = ['e2e', 'unit'];

  const testCommand = new Command(cmd)
    .description(`Run tests in the ${project} app`);

  for (const testType of testTypes) {
    const testTypeCommand = new Command(testType)
      .description(`Run ${testType} tests in the ${project} app`)
      .action((_, p) => {
        let cmd = 'pnpm test';

        if (testType === 'e2e') {
          cmd += ':e2e';
        } else if (p.getOptionValue('watch')) {
          cmd += ':watch';
        }

        runInsideProjects(
          cmd,
          [project],
          {},
          [],
          ['W', 'a', 'w', '-w', '--watch'],
        );
      });

    if (testType === 'unit') {
      testTypeCommand.option('-w, --watch', 'Watch for changes and re-run tests');
    }

    testCommand.addCommand(testTypeCommand, {
      isDefault: testType === 'unit',
    });
  }

  test.addCommand(testCommand);
});

// Create directus command wrapper
const directusCommand = new Command('directus');
const snapshotCommand = new Command('snapshot');
const restoreCommand = new Command('restore');
const bootstrapCommand = new Command('bootstrap');

snapshotCommand.action(directusSnapshot);
restoreCommand.action(directusRestore);
bootstrapCommand.action(bootstrap);

directusCommand.addCommand(snapshotCommand);
directusCommand.addCommand(restoreCommand);
directusCommand.addCommand(bootstrapCommand);

program.addCommand(lint);
program.addCommand(nest);
program.addCommand(prisma);
program.addCommand(test);
program.addCommand(directusCommand);

// Create a wrapper for Vite CLI
program.addCommand(
  new Command('vite')
    .option('-h, --help', 'Output usage information')
    .action(() => {
      // Get the path to the vite binary
      const vitePath = path.resolve(__dirname, './web/node_modules/.bin/vite');

      // Get all the arguments
      const viteArgs = process.argv.slice(3);

      // Execute the vite binary inside web folder
      execa(vitePath, viteArgs, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, './web'),
      });
    }),
);

program.parse(process.argv);

