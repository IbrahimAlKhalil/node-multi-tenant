#!/usr/bin/env node

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function genModelTypes() {
  const { PrismaClient } = await import('../api/prisma/client/index.js');
  const prisma = new PrismaClient({ datasources: { db: { url: `postgres://` } } });
  const dmmf = prisma._baseDmmf;

  const types = [];

  for (const model of dmmf.datamodel.models) {
    const name = (model.name.charAt(0).toLowerCase() +
      model.name.slice(1))

    types.push(`  ${name}: {\n    model: Base.${model.name};\n    whereInput: Base.Prisma.${model.name}WhereInput;\n  };`);
  }

  const imports = `import Base from '../../../prisma/client';\n\n`;
  const exports = `export interface ModelTypes {\n${types.join('\n')}\n}\n`;
  const file = imports + exports;

  await fs.writeFile(path.resolve(__dirname, '../api/src/query/types/model-types.ts'), file, { encoding: 'utf8' });
}

genModelTypes().then(() => {
  console.log('Done');
})