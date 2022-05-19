import { PermissionDefinition as UpdatePermission } from './types/update-permission';
import { PermissionDefinition as DeletePermission } from './types/delete-permission';
import { PermissionDefinition as CreatePermission } from './types/create-permission';
import { PermissionDefinition as ReadPermission } from './types/read-permission';
import { PrismaService } from '../prisma/prisma.service.js';
import { WsException } from '../exceptions/ws-exception.js';
import { ClassifyOptions } from './types/classify-options';
import { ClassifyResult } from './types/classify-result';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '../../prisma/client';
import { DMMF } from '../../prisma/client/runtime';
import { FieldClass } from './types/field-class';
import { ModelNames } from './types/model-names';
import { BaseQuery } from './schema/base-query';
import { Actions, Model } from './types/model';
import { Session } from '../types/session';
import { ModuleRef } from '@nestjs/core';
import isEmpty from 'lodash/isEmpty.js';
import merge from 'lodash/merge.js';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type Permission<T extends keyof Actions<any, any>> = T extends 'read'
  ? ReadPermission<any, any>
  : T extends 'create'
  ? CreatePermission<any, any>
  : T extends 'update'
  ? UpdatePermission<any, any>
  : T extends 'delete'
  ? DeletePermission<any, any>
  : true | void;

@Injectable()
export class QueryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly moduleRef: ModuleRef,
  ) {
    // Load models
    (async () => {
      this.logger.log('Loading models...');

      // Model files
      const files = (
        await fs.readdir(path.resolve(__dirname, './models'))
      ).filter((file) => file.endsWith('.js'));
      const regex = /-([a-z])/g;

      for (const file of files) {
        const model = await import(path.resolve(__dirname, './models', file));
        const name = file
          .replace('.js', '')
          .replace(regex, (match, letter) => letter.toUpperCase());

        this.models[name as ModelNames] = model.default;
      }

      for (const [name, model] of Object.entries(this.models)) {
        if (!name.endsWith('I18n')) {
          continue;
        }

        this.i18nModels[name.replace('I18n', '') as ModelNames] = {
          name: name as ModelNames,
          model,
        };
      }

      this.logger.log(
        `${Object.keys(this.models).length} common models loaded and ${
          Object.keys(this.i18nModels).length
        } i18n models loaded`,
      );
    })();
  }

  private logger = new Logger(QueryService.name);
  public models: Partial<Record<ModelNames, Model<any, ModelNames>>> = {};
  public i18nModels: Partial<
    Record<ModelNames, { name: ModelNames; model: Model<any, ModelNames> }>
  > = {};
  private orderByNestedFields = ['_count', '_sum', '_avg', '_min', '_max'];

  private classifyFields<O extends ClassifyOptions>(
    options: O,
  ): ClassifyResult<O> {
    const modelFields = this.prismaService.fields[options.model];

    if (!modelFields) {
      throw new WsException(
        `Model "${options.model}" doesn't exist.`,
        'QUERY_INVALID',
      );
    }

    const fields = options.fields ?? Object.keys(modelFields);
    const classifications: Partial<Record<FieldClass, string[]>> = {};

    if (options.classes) {
      const classesKeys = Object.keys(options.classes) as FieldClass[];
      const classesLength = classesKeys.length;

      for (let i = 0; i < classesLength; i++) {
        classifications[classesKeys[i]] = [];
      }
    } else {
      classifications.special = [];
      classifications.operator = [];
      classifications.scalar = [];
      classifications.object = [];
      classifications.array = [];
      classifications.relation = [];
      classifications.unknown = [];
      classifications.allowed = [];
      classifications.notAllowed = [];
      classifications.relationAllowed = [];
      classifications.relationNotAllowed = [];
    }

    const fieldsLength = fields.length;
    for (let i = 0; i < fieldsLength; i++) {
      const field = fields[i];

      if (
        field === '_count' ||
        field === '_relevance' ||
        field === '_all' ||
        field === '_sum' ||
        field === '_avg' ||
        field === '_min' ||
        field === '_max'
      ) {
        if (classifications.special) {
          classifications.special.push(field);
        }

        continue;
      }

      if (field === 'OR' || field === 'AND' || field === 'NOT') {
        if (classifications.operator) {
          classifications.operator.push(field);
        }

        continue;
      }

      const modelField = modelFields[field];

      if (!modelField) {
        if (classifications.unknown) {
          classifications.unknown.push(field);
        }

        continue;
      }

      if (
        modelField.kind === 'scalar' ||
        modelField.kind === 'enum' ||
        modelField.kind === 'unsupported'
      ) {
        if (classifications.scalar) {
          classifications.scalar.push(field);
        }

        continue;
      }

      if (modelField.kind === 'object') {
        if (classifications.relation) {
          classifications.relation.push(field);
        }

        if (classifications.array && modelField.isList) {
          classifications.array.push(field);
        } else if (classifications.object) {
          classifications.object.push(field);
        }
      }
    }

    // No need to check for allowed and notAllowed fields, because they are not in the classifications object.
    if (!options.session || !options.action) {
      return classifications as ClassifyResult<O>;
    }

    if (
      classifications.relation &&
      (classifications.relationAllowed || classifications.relationNotAllowed)
    ) {
      const fieldsLength = classifications.relation.length;
      for (let i = 0; i < fieldsLength; i++) {
        const field = classifications.relation[i];
        const modelField = modelFields[field];
        const modelName = this.prismaService.modelsNameMap[modelField.type];

        // Get permission for model
        const permissionModel = this.models[modelName];

        if (!permissionModel) {
          throw new WsException(
            `You don't have permission to access the model "${modelName}" or it doesn't exist.`,
            'PERMISSION_DENIED',
          );
        }

        try {
          // Get permission for read action
          const permission = QueryService.getActionPermission(
            'read',
            modelName,
            permissionModel,
            options.session,
          );

          if (
            permission === true ||
            permission.fields === true ||
            permission.fields.size > 0
          ) {
            if (classifications.relationAllowed) {
              classifications.relationAllowed.push(field);
            }
          }
        } catch (e) {
          if (classifications.relationNotAllowed) {
            classifications.relationNotAllowed.push(field);
          }
        }
      }
    }

    if (
      !classifications.scalar ||
      (!classifications.allowed && !classifications.notAllowed)
    ) {
      return classifications as ClassifyResult<O>;
    }

    // Get permission model
    const permissionModel = this.models[options.model];

    if (!permissionModel) {
      throw new WsException(
        `You don't have permission to access model "${options.model}".`,
        'PERMISSION_DENIED',
      );
    }

    // Get action permission
    const permission = QueryService.getActionPermission(
      options.action,
      options.model,
      permissionModel,
      options.session,
    );

    // Check permission for scalar fields
    if (permission === true || permission.fields === true) {
      classifications.allowed = classifications.scalar;
    } else {
      const length = classifications.scalar.length;
      for (let i = 0; i < length; i++) {
        const field = classifications.scalar[i];

        if (!permission.fields.has(field)) {
          if (classifications.notAllowed) {
            classifications.notAllowed.push(field);
          }

          continue;
        }

        if (classifications.allowed) {
          classifications.allowed.push(field);
        }
      }
    }

    return classifications as ClassifyResult<O>;
  }

  private static getActionPermission<T extends keyof Actions<any, any>>(
    action: T,
    modelName: ModelNames,
    permissionModel: Model<any, ModelNames>,
    session: Session,
  ): Permission<T> | true {
    let kind: typeof permissionModel.kinds.ALL = permissionModel.kinds.ALL;

    if (permissionModel.kinds.hasOwnProperty(session.knd)) {
      kind = permissionModel.kinds[session.knd];
    } else if (
      session.knd === 'STAFF' ||
      session.knd === 'ADMIN' ||
      session.knd === 'SUPPORTER'
    ) {
      // Power user
      kind = permissionModel.kinds.POWER ?? permissionModel.kinds.ALL;
    } else if (
      session.knd === 'GUARDIAN' ||
      session.knd === 'STUDENT' ||
      session.knd === 'GENERAL'
    ) {
      // Non-power user
      kind = permissionModel.kinds.NON_POWER ?? permissionModel.kinds.ALL;
    }

    if (!kind) {
      throw new WsException(
        `You don't have permission to perform any action on model "${modelName}".`,
        'PERMISSION_DENIED',
      );
    }

    if (kind === true) {
      return true;
    }

    const actionPermission = kind[action] as unknown;

    if (!actionPermission) {
      throw new WsException(
        `You don't have permission to perform action "${action}" on model "${modelName}".`,
        'PERMISSION_DENIED',
      );
    }

    return actionPermission as any;
  }

  private addDefaultSelects(
    queue: BaseQuery[],
    baseQuery: BaseQuery,
    session: Session,
    modelFields: Record<string, DMMF.Field>,
  ): void {
    // User did not specify any fields to select, so we will select default fields
    baseQuery.query.select = {};

    // Add included fields to queue if exists
    if (baseQuery.query.include) {
      const fields = this.classifyFields({
        model: baseQuery.model,
        fields: Object.keys(baseQuery.query.include),
        classes: {
          relation: true,
          unknown: true,
        },
      });

      QueryService.checkFieldPermissions(baseQuery.model, fields);

      // Add fields to queue
      const relationLength = fields.relation.length;
      for (let i = 0; i < relationLength; i++) {
        const relation = fields.relation[i];
        const modelField = modelFields[relation];

        if (typeof baseQuery.query.include[relation] === 'boolean') {
          baseQuery.query.include[relation] = {};
        }

        queue.push({
          type: baseQuery.type,
          model: this.prismaService.modelsNameMap[modelField.type],
          query: baseQuery.query.include[relation],
          subscribe: baseQuery.subscribe,
        });
      }
    }

    const fields = this.classifyFields({
      session,
      action: 'read',
      classes: {
        scalar: true,
        allowed: true,
      },
      model: baseQuery.model,
    });

    const query = baseQuery.query;

    if (fields.scalar.length === fields.allowed.length) {
      // User has access to all fields
      // Add all scalar fields

      if (isEmpty(query.include)) {
        delete query.select;
        delete query.include;
        return;
      }

      const fieldsLength = fields.scalar.length;
      for (let i = 0; i < fieldsLength; i++) {
        const field = fields.scalar[i];
        query.select[field] = true;
      }
    } else {
      // User has access to some fields
      // Add only permitted fields

      const fieldsLength = fields.allowed.length;
      for (let i = 0; i < fieldsLength; i++) {
        const field = fields.allowed[i];
        query.select[field] = true;
      }
    }

    if (query.include) {
      Object.assign(query.select, query.include);
      delete query.include;
    }
  }

  private addDefaultCountSelects(baseQuery: BaseQuery, session: Session): void {
    const fields = this.classifyFields({
      session,
      action: 'read',
      model: baseQuery.model,
      classes: {
        relation: true,
        relationAllowed: true,
      },
    });

    const { select } = baseQuery.query;

    if (fields.relation.length === 0) {
      select._count = true;
      return;
    }

    const permissionModel = this.models[baseQuery.model];
    const modelFields = this.prismaService.fields[baseQuery.model];

    if (!modelFields || !permissionModel) {
      throw new WsException(
        `You don't have access to model ${baseQuery.model} or it doesn't exist`,
        'PERMISSION_DENIED',
      );
    }

    if (
      fields.relationAllowed.length === 0 ||
      fields.relationAllowed.length === fields.relation.length
    ) {
      select._count = true;
      return;
    }

    if (select._count === true) {
      select._count = {
        select: {},
      };
    }

    if (!select._count.select) {
      select._count.select = {};
    }

    const length = fields.relationAllowed.length;
    for (let i = 0; i < length; i++) {
      select._count.select[fields.relationAllowed[i]] = true;
    }
  }

  private checkCountSelects(baseQuery: BaseQuery, session: Session): void {
    const fields = this.classifyFields({
      session,
      action: 'read',
      model: baseQuery.model,
      fields: Object.keys(baseQuery.query.select._count.select),
      classes: {
        relation: true,
        relationAllowed: true,
        relationNotAllowed: true,
        unknown: true,
      },
    });

    if (fields.relationNotAllowed.length > 0) {
      throw new WsException(
        `You don't have permission to count "${fields.relationNotAllowed.join(
          `, `,
        )}" on "${baseQuery.model}".`,
        'QUERY_INVALID',
      );
    }

    if (fields.unknown.length > 0) {
      throw new WsException(
        `Relation(s) "${fields.unknown.join(`, `)}" don't exist on "${
          baseQuery.model
        }".`,
        'QUERY_INVALID',
      );
    }
  }

  private checkWhere(
    rootWhere: { model: ModelNames; where: Record<string, any> },
    session: Session,
  ): void {
    const queue: typeof rootWhere[] = [rootWhere];

    for (let q = 0; q < queue.length; q++) {
      const where = queue[q];

      if (!where) {
        continue;
      }

      const permissionModel = this.models[where.model];
      const modelFields = this.prismaService.fields[where.model];

      if (!permissionModel || !modelFields) {
        // Permission for this model is not defined
        throw new WsException(
          `Model "${where.model}" doesn't exist`,
          'QUERY_INVALID',
        );
      }

      const specifiedFields = this.classifyFields({
        session,
        model: where.model,
        action: 'read',
        fields: Object.keys(where.where),
        classes: {
          scalar: true,
          object: true,
          array: true,
          allowed: true,
          notAllowed: true,
          unknown: true,
          operator: true,
        },
      });

      QueryService.checkFieldPermissions(where.model, specifiedFields);

      // Add object fields to the queue
      const objectLength = specifiedFields.object.length;
      for (let i = 0; i < objectLength; i++) {
        const field = specifiedFields.object[i];

        queue.push({
          model: this.prismaService.modelsNameMap[modelFields[field].type],
          where: where.where[field],
        });
      }

      // Add array fields to the queue
      const arrayLength = specifiedFields.array.length;
      for (let i = 0; i < arrayLength; i++) {
        const field = specifiedFields.array[i];

        // Array filters may contain "some", "every", "none", "is", and isNot
        const arrayFilter = where.where[field];
        const arrayFilterKeys = Object.keys(arrayFilter);
        const arrayFilterLength = arrayFilterKeys.length;

        for (let j = 0; j < arrayFilterLength; j++) {
          queue.push({
            model: this.prismaService.modelsNameMap[modelFields[field].type],
            where: arrayFilter[arrayFilterKeys[j]],
          });
        }
      }

      // Add "OR", "AND" and "NOT" operators to the queue
      const otherLength = specifiedFields.operator.length;
      for (let i = 0; i < otherLength; i++) {
        const field = specifiedFields.operator[i];

        if (field === 'OR' || field === 'AND' || field === 'NOT') {
          if (Array.isArray(where.where[field])) {
            const length = where.where[field].length;

            for (let j = 0; j < length; j++) {
              queue.push({
                model: where.model,
                where: where.where[field][j],
              });
            }
          } else {
            queue.push({
              model: where.model,
              where: where.where[field],
            });
          }
        } else {
          throw new WsException(
            `Field "${field}" doesn't exist on model "${where.model}".`,
            'QUERY_INVALID',
          );
        }
      }
    }
  }

  private static checkFieldPermissions(
    model: ModelNames,
    fields: ClassifyResult<any>,
  ): void {
    if (fields.unknown?.length) {
      throw new WsException(
        `Field(s) "${fields.unknown.join(
          `, `,
        )}" don't exist on model "${model}".`,
        'QUERY_INVALID',
      );
    }

    if (fields.notAllowed?.length) {
      throw new WsException(
        `Field(s) "${fields.notAllowed.join(
          `, `,
        )}" are not allowed on model "${model}".`,
        'QUERY_INVALID',
      );
    }
  }

  private async applyPermissions(
    action: Exclude<keyof Actions<any, any>, 'subscribe' | 'create'>,
    session: Session,
    baseQuery: BaseQuery,
    permissionModel: Model<any, any>,
  ): Promise<boolean> {
    const permission = QueryService.getActionPermission(
      action,
      baseQuery.model,
      permissionModel,
      session,
    );

    if (permission === true) {
      return true;
    }

    let permissionQuery: any;

    if (typeof permission.permission === 'function') {
      permissionQuery = await permission.permission(
        session,
        baseQuery.query,
        this.moduleRef,
      );
    } else {
      permissionQuery = structuredClone(permission.permission);
    }

    if (!permissionQuery) {
      throw new WsException(
        `You don't have permission to perform "${action}" on "${baseQuery.model}".`,
        'PERMISSION_DENIED',
      );
    }

    if (permissionQuery === true) {
      return true;
    }

    const baseWhere = baseQuery.query.where;
    const permissionWhere = permissionQuery.where;

    if (baseWhere) {
      delete baseQuery.query.where;

      if (permissionWhere) {
        permissionQuery.where = {
          AND: [permissionWhere, baseWhere],
        };
      } else {
        permissionQuery.where = baseWhere;
      }
    }

    merge(baseQuery.query, permissionQuery);

    return true;
  }

  private checkOrderBy(baseQuery: BaseQuery, session: Session): void {
    debugger;

    const orderBys = Array.isArray(baseQuery.query.orderBy)
      ? baseQuery.query.orderBy
      : [baseQuery.query.orderBy];
    const queue: { model: ModelNames; fields: Record<string, any> }[] = [];

    const orderByLength = orderBys.length;
    for (let i = 0; i < orderByLength; i++) {
      const orderBy = orderBys[i];

      queue.push({
        model: baseQuery.model,
        fields: orderBy,
      });
    }

    for (let q = 0; q < queue.length; q++) {
      const orderBy = queue[q];

      const fieldSetToCheck: string[][] = [Object.keys(orderBy.fields)];

      if (orderBy.fields._relevance) {
        if (typeof orderBy.fields._relevance.fields === 'string') {
          fieldSetToCheck.push([orderBy.fields._relevance.fields]);
        } else if (Array.isArray(orderBy.fields._relevance.fields)) {
          fieldSetToCheck.push(orderBy.fields._relevance.fields);
        }
      }

      const onfLength = this.orderByNestedFields.length;
      for (let i = 0; i < onfLength; i++) {
        const onf = this.orderByNestedFields[i];

        if (orderBy.fields[onf]) {
          fieldSetToCheck.push(Object.keys(orderBy.fields[onf]));
        }
      }

      const fields = this.classifyFields({
        session,
        action: 'read',
        model: orderBy.model,
        fields: Array.from(new Set(fieldSetToCheck.flat())),
        classes: {
          scalar: true,
          relation: true,
          unknown: true,
          notAllowed: true,
          special: true,
        },
      });

      QueryService.checkFieldPermissions(orderBy.model, fields);

      if (fields.relation.length) {
        const length = fields.relation.length;
        for (let i = 0; i < length; i++) {
          const relation = fields.relation[i];
          const permissionModel = this.models[orderBy.model];
          const modelFields = this.prismaService.fields[orderBy.model];

          if (!modelFields || !permissionModel) {
            throw new WsException(
              `You don't have access to "${orderBy.model}" model or it doesn't exist.`,
              'PERMISSION_DENIED',
            );
          }

          const modelField = modelFields[relation];

          queue.push({
            model: this.prismaService.modelsNameMap[modelField.type],
            fields: orderBy.fields[relation],
          });
        }
      }
    }
  }

  private processSelect(
    queue: BaseQuery[],
    baseQuery: BaseQuery,
    session: Session,
    modelFields: Record<string, DMMF.Field>,
  ): void {
    // Classify fields
    const fields = this.classifyFields({
      session,
      classes: {
        scalar: true,
        allowed: true,
        notAllowed: true,
        unknown: true,
        relation: true,
      },
      model: baseQuery.model,
      fields: Object.keys(baseQuery.query.select),
      action: 'read',
    });

    // Check if user has permission to read these fields
    QueryService.checkFieldPermissions(baseQuery.model, fields);

    // Handle _count special field
    const countQuery = baseQuery.query.select._count;

    if (countQuery) {
      if (countQuery === true) {
        this.addDefaultCountSelects(baseQuery, session);
      } else if (typeof countQuery === 'object' && !Array.isArray(countQuery)) {
        if (isEmpty(countQuery.select)) {
          this.addDefaultCountSelects(baseQuery, session);
        } else {
          this.checkCountSelects(baseQuery, session);
        }
      } else {
        throw new WsException(
          `Invalid count query "${countQuery}"`,
          'QUERY_INVALID',
        );
      }
    }

    // Add relational fields to queue
    const fieldsLength = fields.relation.length;
    for (let i = 0; i < fieldsLength; i++) {
      const field = fields.relation[i];
      const modelField = modelFields[field];

      if (
        !baseQuery.query.select[field] ||
        Array.isArray(baseQuery.query.select[field]) ||
        typeof baseQuery.query.select[field] !== 'object'
      ) {
        baseQuery.query.select[field] = {};
      }

      queue.push({
        type: baseQuery.type,
        model: this.prismaService.modelsNameMap[modelField.type],
        query: baseQuery.query.select[field],
        subscribe: baseQuery.subscribe,
      });
    }
  }

  public async find(
    rootQuery: BaseQuery,
    session: Session,
    trx?: PrismaClient,
  ): Promise<any> {
    const queue: BaseQuery[] = [rootQuery];

    const prisma = trx ?? (await this.prismaService.getPrisma(session.iid));

    if (!prisma) {
      throw new WsException(
        `Instance #${session.iid} is either not found or not active`,
        'UNAUTHORIZED',
      );
    }

    for (let q = 0; q < queue.length; q++) {
      const baseQuery = queue[q];

      if (!baseQuery) {
        continue;
      }

      const permissionModel = this.models[baseQuery.model];
      const modelFields = this.prismaService.fields[baseQuery.model];

      if (!permissionModel || !modelFields) {
        // Permission for this model is not defined
        throw new WsException(
          `You don't have access to model "${baseQuery.model}" or it doesn't exist.`,
          'PERMISSION_DENIED',
        );
      }

      // Check if user has permission to subscribe to this model
      if (baseQuery.subscribe) {
        QueryService.getActionPermission(
          'subscribe',
          baseQuery.model,
          permissionModel,
          session,
        );
      }

      if (baseQuery.query.select) {
        this.processSelect(queue, baseQuery, session, modelFields);
      } else {
        // Add default fields to select
        this.addDefaultSelects(queue, baseQuery, session, modelFields);
      }

      if (baseQuery.query.orderBy) {
        this.checkOrderBy(baseQuery, session);
      }

      // Check permission for orderBy and cursor fields
      const objClauses = ['cursor', '_sum', '_avg', '_min', '_max'];
      const arrClauses = ['distinct', 'by'];
      const fieldSetToCheck: string[][] = [];

      const objLength = objClauses.length;
      for (let i = 0; i < objLength; i++) {
        const clause = objClauses[i];
        if (baseQuery.query[clause]) {
          fieldSetToCheck.push(Object.keys(baseQuery.query[clause]));
        }
      }

      const arrLength = arrClauses.length;
      for (let i = 0; i < arrLength; i++) {
        const clause = arrClauses[i];
        if (!baseQuery.query[clause]) {
          continue;
        }

        if (typeof baseQuery.query[clause] === 'string') {
          fieldSetToCheck.push([baseQuery.query[clause]]);
        } else if (Array.isArray(baseQuery.query[clause])) {
          fieldSetToCheck.push(baseQuery.query[clause]);
        }
      }

      if (fieldSetToCheck.length) {
        QueryService.checkFieldPermissions(
          baseQuery.model,
          this.classifyFields({
            session,
            action: 'read',
            model: baseQuery.model,
            fields: Array.from(new Set(fieldSetToCheck.flat())),
            classes: {
              scalar: true,
              notAllowed: true,
              unknown: true,
            },
          }),
        );
      }

      // Check permission for fields specified in where clause
      if (baseQuery.query.where) {
        this.checkWhere(
          {
            model: baseQuery.model,
            where: baseQuery.query.where,
          },
          session,
        );
      }

      if (baseQuery.query.having) {
        this.checkWhere(
          {
            model: baseQuery.model,
            where: baseQuery.query.having,
          },
          session,
        );
      }

      // Add permission query to base query
      await this.applyPermissions('read', session, baseQuery, permissionModel);
    }

    return (prisma[rootQuery.model][rootQuery.type] as any)(rootQuery.query);
  }

  public async create(
    rootQuery: BaseQuery,
    session: Session,
    trx?: PrismaClient,
  ): Promise<any> {
    const queue: BaseQuery[] = [rootQuery];

    const prisma = trx ?? (await this.prismaService.getPrisma(session.iid));

    if (!prisma) {
      throw new WsException(
        `Instance #${session.iid} is either not found or not active`,
        'UNAUTHORIZED',
      );
    }

    return (prisma[rootQuery.model][rootQuery.type] as any)(rootQuery.query);
  }
}
