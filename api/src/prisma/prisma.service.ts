import { PrismaClient, RoleCrudPermission } from '../../prisma/client';
import { InstituteService } from '../institute/institute.service.js';
import { Unauthorized } from '../auth/exceptions/unauthorized.js';
import { PrismaInstance } from '../types/prisma-instance';
import { ModelNames } from '../query/types/model-names';
import { DMMFClass } from '../../prisma/client/runtime';
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

  public async getPrismaOrThrow(...args: Parameters<PrismaService['getPrisma']>): Promise<PrismaClient>  {
    const prisma = await this.getPrisma(...args);

    if (!prisma) {
      throw new Unauthorized(
        `Institute #${args[0]} is either not found or not active`,
      );
    }

    return prisma;
  }

  private static async getModels(): Promise<Model[]> {
    const { PrismaClient } = await import('../../prisma/client/index.js');
    const prisma = new PrismaClient({ datasources: { db: { url: `postgres://` } } });
    const dmmf: DMMFClass = (prisma as any)._baseDmmf;

    await prisma.$disconnect();

    return dmmf.datamodel.models.map((model) => {
      const primaryKey: string[] = [];
      const uniqueFields: string[][] = [];
      const scalarFields: string[] = [];
      const foreignFields: string[] = [];

      // Find the primary key
      if (model.primaryKey) {
        for (const pKey of model.primaryKey.fields) {
          primaryKey.push(pKey);
        }
      }

      // Find the unique fields
      if (model.uniqueFields.length > 0) {
        for (const uniqueFieldGroup of model.uniqueFields) {
          const group: string[] = [];

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

        if (field.kind === 'scalar') {
          scalarFields.push(field.name);
        }

        if (field.relationName && field.relationFromFields?.length) {
          foreignFields.push(...field.relationFromFields);
        }
      }

      return {
        name: model.name,
        fields: model.fields,
        scalarFieldsSet: new Set(scalarFields),
        foreignFields,
        scalarFields,
        uniqueFields,
        primaryKey,
      };
    });
  }

  public async getRolePermissions(instituteId: string): Promise<Required<PrismaInstance>['rolePermissions']> {
    const prisma = await this.getPrisma(instituteId);

    if (!prisma) {
      return new Map();
    }

    if (this.instances[instituteId].rolePermissions) {
      return this.instances[instituteId].rolePermissions as Required<PrismaInstance>['rolePermissions'];
    }

    const map: PrismaInstance['rolePermissions'] = new Map();
    const roles = await prisma.role.findMany({
      include: {
        RolePermissions: true,
      }
    });

    for (const role of roles) {
      const permissions: Partial<Record<ModelNames, RoleCrudPermission>> = {};

      for (const permission of role.RolePermissions) {
        permissions[permission.table as ModelNames] = permission;
      }

      map.set(role.id, permissions);
    }

    this.instances[instituteId].rolePermissions = map;

    return map;
  }
}
