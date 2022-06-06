import { InstituteService } from '../institute/institute.service.js';
import { PrismaInstance } from '../types/prisma-instance';
import { ModelNames } from '../query/types/model-names';
import { PrismaClient } from '../../prisma/client';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { Model } from './types/model';
import { Field } from './types/field';

@Injectable()
export class PrismaService {
  constructor(
    private readonly instituteService: InstituteService,
    private readonly config: Config,
  ) {
    setInterval(() => {
      const now = Date.now();

      for (const instituteId in this.instituteService.institutes) {
        if (this.instances.hasOwnProperty(instituteId)) {
          const instance = this.instances[instituteId];

          if (now - instance.lastUsed > this.config.prisma.maxAge) {
            delete this.instances[instituteId];
          }
        }
      }
    }, 5 * 60 * 1000);

    PrismaService.getModels().then((models) => {
      for (const model of models) {
        const camelCaseModelName = (model.name.charAt(0).toLowerCase() +
          model.name.slice(1)) as ModelNames;
        this.models[camelCaseModelName] = model;
        this.modelsOriginal[model.name] = model;
        this.modelsNameMap[model.name] = camelCaseModelName;

        for (const field of model.fields) {
          const fields = this.fields[camelCaseModelName] ?? {};
          this.fields[camelCaseModelName] = fields;

          fields[field.name] = field;

          if (field.relationName) {
            const relations = this.relations[camelCaseModelName] ?? {};
            this.relations[camelCaseModelName] = relations;

            relations[field.relationName] = field;
          }
        }
      }
    });
  }

  private instances: { [instituteId: string]: PrismaInstance } = {};
  public models: Partial<Record<ModelNames, Model>> = {};
  public modelsOriginal: Record<string, Model> = {};
  public modelsNameMap: Record<string, ModelNames> = {};
  public fields: Partial<Record<ModelNames, Record<string, Field>>> = {};
  public relations: Partial<Record<ModelNames, Record<string, Field>>> = {};

  public async getPrisma(instituteId: string): Promise<PrismaClient | null> {
    // Check if the institute exists
    if (!this.instituteService.institutes.hasOwnProperty(instituteId)) {
      // Institute does not exist
      return null;
    }

    let prisma: PrismaClient;

    if (this.instances.hasOwnProperty(instituteId)) {
      // A prisma instance for this institute already exists
      // Return it

      const instance = this.instances[instituteId];
      instance.lastUsed = Date.now();
      prisma = instance.prisma;
    } else {
      // No prisma instance for this institute exists yet

      const { PrismaClient } = await import('../../prisma/client/index.js');
      const institute = this.instituteService.institutes[instituteId];
      const config = this.config.postgres;

      // Instantiate a new prisma instance
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${institute.database}`,
          },
        },
      });

      // Add the new prisma instance to the instances list
      this.instances[instituteId] = {
        lastUsed: Date.now(),
        prisma,
      };
    }

    return prisma;
  }

  private static async getModels(): Promise<Model[]> {
    const { PrismaClient } = await import('../../prisma/client/index.js');
    const prisma = new PrismaClient({ datasources: { db: { url: `postgres://` } } });
    const dmmf = (prisma as any)._dmmf;

    await prisma.$disconnect();

    const models: Model[] = [];

    for (const model of dmmf.datamodel.models) {
      models.push(model);

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
        delete field.isUpdatedAt;
        delete field.relationOnDelete;
      }

      delete model.dbName;
      delete model.isGenerated;
      delete model.uniqueIndexes;

      model.primaryKey = primaryKey;
      model.uniqueFields = uniqueFields;
    }

    return models;
  }
}
