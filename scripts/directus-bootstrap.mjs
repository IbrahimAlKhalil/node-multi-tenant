import { directusRestore } from './directus-restore.mjs';
import { getDirectusEnv } from './get-directus-env.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function bootstrap() {
  const directusPath = path.join(__dirname, '../website/node_modules/.bin/directus');

  await execa(directusPath, ['bootstrap'], {
    cwd: path.join(__dirname, '../website'),
    stdio: 'pipe',
    env: {
      ...process.env,
      ...getDirectusEnv(),
      FORCE_COLOR: true,
    },
  });

  await directusRestore();
}