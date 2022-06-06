import { getDirectusEnv } from './get-directus-env.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function directusRestore() {
  const directusPath = path.join(__dirname, '../website/node_modules/.bin/directus');

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