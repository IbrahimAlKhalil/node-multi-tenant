import path, { dirname } from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function zipAdd(zip, paths, srcPath, zipPath) {
  for (const _path of paths) {
    const absPath = path.resolve(__dirname, srcPath, _path);
    const stat = await fs.lstat(absPath);

    if (stat.isDirectory()) {
      zip.addLocalFolder(absPath, zipPath ? `${zipPath}/${_path}` : _path);
    } else {
      zip.addLocalFile(absPath, zipPath);
    }
  }
}

export async function pack() {
  // Clear dist directory if exists
  try {
    await fs.rm(path.resolve(__dirname, '../dist'), { recursive: true });
  } catch (e) {
    // Ignore
  }

  // Create dist directory
  await fs.mkdir(path.resolve(__dirname, '../dist'));

  const api = new AdmZip();
  const web = new AdmZip();
  const website = new AdmZip();

  await Promise.all([
    zipAdd(api, ['dist', 'prisma'], '../api', '.'),
    zipAdd(api, ['dist', 'prisma', 'README.md', 'package.json'], '../api'),
    zipAdd(web, ['dist'], '../web'),
    zipAdd(website, ['dist', 'prisma'], '../website', '.'),
    zipAdd(website, ['dist', 'prisma', 'README.md', 'package.json'], '../website'),
  ]);

  api.writeZip(path.resolve(__dirname, '../dist', 'api.zip'));
  web.writeZip(path.resolve(__dirname, '../dist', 'web.zip'));
  website.writeZip(path.resolve(__dirname, '../dist', 'website.zip'));
}
