import { getDirectusEnv } from './get-directus-env.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const directusPath = path.join(__dirname, '../website/node_modules/.bin/directus');

export async function restore() {
  await execa(directusPath, ['schema', 'apply', './snapshot.yaml', '-y'], {
    cwd: path.join(__dirname, '../website'),
    stdio: 'pipe',
    env: {
      ...process.env,
      ...getDirectusEnv(),
      FORCE_COLOR: true,
    },
  });
}

export async function snapshot() {
  await execa(directusPath, ['schema', 'snapshot', './snapshot.yaml', '-y'], {
    cwd: path.join(__dirname, '../website'),
    stdio: 'pipe',
    env: {
      ...process.env,
      ...getDirectusEnv(),
      FORCE_COLOR: true,
    },
  });
}

export async function bootstrap() {
  await execa(directusPath, ['bootstrap'], {
    cwd: path.join(__dirname, '../website'),
    stdio: 'pipe',
    env: {
      ...process.env,
      ...getDirectusEnv(),
      FORCE_COLOR: true,
    },
  });

  await restore();
}

export async function migrate(direction) {
  await execa(directusPath, ['database', `migrate:${direction}`], {
    cwd: path.join(__dirname, '../website'),
    stdio: 'pipe',
    env: {
      ...process.env,
      ...getDirectusEnv(),
      FORCE_COLOR: true,
    },
  });
}