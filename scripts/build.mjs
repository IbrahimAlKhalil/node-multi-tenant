import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { pack } from './pack.mjs';
import { execa } from 'execa';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildNestApp(dir, name) {
  console.log(chalk.bold.whiteBright(`Building ${name}...`));

  await fs.rm(path.resolve(__dirname, `../${dir}/dist`), {
    force: true,
    recursive: true,
  });

  // Get nest CLI
  const nest = path.resolve(__dirname, `../${dir}/node_modules/@nestjs/cli/bin/nest.js`);

  // Build API
  await execa(`node ${nest}`, ['build'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, `../${dir}`),
    shell: true,
  });

  console.log(chalk.bold.greenBright('Done ✓'));
}

async function buildWeb() {
  console.log(chalk.bold.whiteBright('Building Web...'));

  await fs.rm(path.resolve(__dirname, '../web/dist'), {
    force: true,
    recursive: true,
  });

  // Get vue-tsc CLI
  const vueTSC = path.resolve(__dirname, '../web/node_modules/vue-tsc/bin/vue-tsc.js');

  // Run Vue TSC
  await execa(`node ${vueTSC}`, ['--noEmit'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../web'),
    shell: true,
  });

  // Build Web
  const vite = path.resolve(__dirname, '../web/node_modules/vite/bin/vite.js');
  await execa(`node ${vite}`, ['build'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../web'),
    shell: true,
  });

  console.log(chalk.bold.greenBright('Done ✓'));
}

async function buildWebsite() {
  console.log(chalk.bold.whiteBright('Building Website...'));

  await fs.rm(path.resolve(__dirname, '../website/dist'), {
    force: true,
    recursive: true,
  });

  await fs.rm(path.resolve(__dirname, '../website/server-dist'), {
    force: true,
    recursive: true,
  });

  const vite = path.resolve(__dirname, '../website/node_modules/.bin/vite');
  const tsc = path.resolve(__dirname, '../website/node_modules/.bin/tsc');

  await execa(vite, ['build'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../website'),
    shell: true,
  });

  await execa(vite, ['build', '--ssr'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../website'),
    shell: true,
  });

  await execa(tsc, ['--project', './server/'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../website'),
    shell: true,
  });

  console.log(chalk.bold.greenBright('Done ✓'));
}

export async function build(api, web, website, _pack) {
  if (api) {
    await buildNestApp('api', 'API');
  }

  if (website) {
    await buildWebsite();
  }

  if (web) {
    await buildWeb();
  }

  if (_pack) {
    await pack();
  }

  if (!api && !web && !website && !_pack) {
    // Build all
    await buildNestApp('api', 'API');
    await buildNestApp('website', 'Website');
    await buildWeb();
    await pack();
  }
}
