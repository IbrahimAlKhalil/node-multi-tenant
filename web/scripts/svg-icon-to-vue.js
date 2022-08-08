import { fileURLToPath } from 'url';
import svgo from 'svgo';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../website/resources/icons');
const dest = path.resolve(__dirname, './src/resources/icons');

const groups = await fs.promises.readdir(src);

await ensureDir(dest);

for (const group of groups) {
  const files = await fs.promises.readdir(path.join(src, group));
  const prefix = `fa${group.charAt(0)}`;

  await ensureDir(path.join(dest, group));

  for (const file of files) {
    fs.promises.readFile(path.join(src, group, file), 'utf-8').then((svg) => {
      const optimized = svgo.optimize(svg, {
        plugins: [
          {
            name: 'preset-default',
          },
          {
            name: 'addClassesToSVGElement',
            params: {
              classNames: ['fa'],
            },
          },
        ],
      });

      fs.promises.writeFile(
        path.join(dest, group, `${prefix}-${path.basename(file, '.svg')}.vue`),
        `<template>${optimized.data}</template>`,
      );
    });
  }
}

async function ensureDir(dir) {
  try {
    await fs.promises.stat(dir);
  } catch (e) {
    await fs.promises.mkdir(dir);
  }
}
