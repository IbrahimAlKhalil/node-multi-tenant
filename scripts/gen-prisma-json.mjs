import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import sdk from '@prisma/sdk';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generate(prismaDir) {
  // Parse the schema.prisma file
  const schema = await sdk.getDMMF({
    datamodelPath: path.join(prismaDir, './schema.prisma'),
  });

  const processedModels = [];

  for (const model of schema.datamodel.models) {
    processedModels.push(model);

    const primaryKey = [];
    const uniqueFields = [];

    // Find the primary key
    if (model.primaryKey) {
      for (const pKey of model.primaryKey.fields) {
        primaryKey.push(pKey);
      }
    }

    // Find the unique fields
    if (model.uniqueFields.length > 0) {
      for (const uniqueFieldGroup of model.uniqueFields) {
        const group = [];

        for (const uniqueField of uniqueFieldGroup) {
          group.push(uniqueField);
        }

        uniqueFields.push(group);
      }
    }

    for (const field of model.fields) {
      if (field.isUnique) {
        uniqueFields.push([field.name]);
      }

      if (field.isId) {
        primaryKey.push(field.name);
      }

      delete field.isId;
      delete field.isUnique;
      delete field.dbNames;
      delete field.isGenerated;
      delete field.default;
      delete field.documentation;
      delete field.hasDefaultValue;
      delete field.isReadOnly;
      delete field.isRequired;
      delete field.isUpdatedAt;
      delete field.relationOnDelete;
    }

    delete model.dbName;
    delete model.isGenerated;
    delete model.uniqueIndexes;

    model.primaryKey = primaryKey;
    model.uniqueFields = uniqueFields;
  }

  await fs.writeFile(path.join(prismaDir, './prisma.json'), JSON.stringify(processedModels, null, 2), 'utf-8');
}

export async function run(api, website) {
  if (api) {
    await generate(path.resolve(__dirname, '../api/prisma'));
  }

  if (website) {
    await generate(path.resolve(__dirname, '../website/prisma'));
  }

  if (!api && !website) {
    await generate(path.resolve(__dirname, '../api/prisma'));
    await generate(path.resolve(__dirname, '../website/prisma'));
  }
}