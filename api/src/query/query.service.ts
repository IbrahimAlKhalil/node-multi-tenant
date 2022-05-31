import { PermissionDefinition as UpdatePermission } from './types/update-permission';
import { PermissionDefinition as DeletePermission } from './types/delete-permission';
import { PermissionDefinition as CreatePermission } from './types/create-permission';
import { PermissionDefinition as ReadPermission } from './types/read-permission';
import { FKeyHolder, Relation, RelationAnalyzed } from './types/relation';
import { BaseQuery, MutationType, QueryType } from './schema/base-query';
import { PrismaService } from '../prisma/prisma.service.js';
import { WsException } from '../exceptions/ws-exception.js';
import { ClassifyOptions } from './types/classify-options';
import { Prisma, PrismaClient } from '../../prisma/client';
import { ClassifyResult } from './types/classify-result';
import { EventEmitter2 } from '@nestjs/event-emitter';
import TransactionClient = Prisma.TransactionClient;
import { Injectable, Logger } from '@nestjs/common';
import { Mutation, Parent } from './types/mutation';
import { FieldClass } from './types/field-class';
import { ModelNames } from './types/model-names';
import { Actions, Model } from './types/model';
import { Field } from '../prisma/types/field';
import cloneDeep from 'lodash/cloneDeep.js';
import { Session } from '../types/session';
import isObject from 'lodash/isObject.js';
import { ModuleRef } from '@nestjs/core';
import isEmpty from 'lodash/isEmpty.js';
import merge from 'lodash/merge.js';
import { fileURLToPath } from 'url';
import pick from 'lodash/pick.js';
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
    private readonly eventEmitter: EventEmitter2,
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
    modelFields: Record<string, Field>,
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

  private static flattenUniqueWhere<T = Record<string, any>>(where: T): T {
    const flattenWhere: Record<string, any> = { ...where };

    for (const field of Object.keys(flattenWhere)) {
      if (isObject(flattenWhere[field])) {
        merge(flattenWhere, flattenWhere[field]);
        delete flattenWhere[field];
      }
    }

    return flattenWhere as T;
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
      permissionQuery = cloneDeep(permission.permission);
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
    modelFields: Record<string, Field>,
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

  private analyzeRelation(field: Field): RelationAnalyzed {
    const rightModelName = this.prismaService.modelsNameMap[field.type];
    const rightModel = this.prismaService.models[rightModelName];

    if (!rightModel) {
      throw new WsException(
        `You don't have access to model "${rightModelName}" or it doesn't exist.`,
        'PERMISSION_DENIED',
      );
    }

    if (!field.relationName) {
      throw new Error(`Relation name is missing for field "${field.name}"`);
    }

    const rightField =
      this.prismaService.relations[rightModelName]?.[field.relationName];

    if (!rightField) {
      throw new Error('Something went wrong, please contact support.');
    }

    const left: RelationAnalyzed['left'] = {
      model: this.prismaService.modelsOriginal[rightField.type],
      target: this.prismaService.modelsNameMap[rightField.type],
      type: rightField.isList ? 'many' : 'one',
      field,
    };

    const right: RelationAnalyzed['right'] = {
      target: this.prismaService.modelsNameMap[field.type],
      type: field.isList ? 'many' : 'one',
      model: rightModel,
      field: rightField,
    };

    let fKeyHolder: FKeyHolder;
    let nonFKeyHolder: Relation;

    if (field.relationFromFields?.length || field.relationToFields?.length) {
      fKeyHolder = left as FKeyHolder;
      fKeyHolder.fieldsFrom = field.relationFromFields ?? [];
      fKeyHolder.fieldsTo = field.relationToFields ?? [];
      nonFKeyHolder = right;
    } else {
      fKeyHolder = right as FKeyHolder;
      fKeyHolder.fieldsFrom = rightField.relationFromFields ?? [];
      fKeyHolder.fieldsTo = rightField.relationToFields ?? [];
      nonFKeyHolder = left;
    }

    return {
      left,
      right,
      fKeyHolder,
      nonFKeyHolder,
    };
  }

  private checkUniqueWhere(
    where: Record<string, any>,
    session: Session,
    modelName: ModelNames,
  ): Record<string, any> {
    const model = this.prismaService.models[modelName];

    if (!model) {
      throw new WsException(
        `You don't have access to model "${modelName}" or it doesn't exist.`,
        'PERMISSION_DENIED',
      );
    }

    const flattenWhere = QueryService.flattenUniqueWhere(where);
    const fields = Object.keys(flattenWhere);

    for (const field of fields) {
      if (model.primaryKey.includes(field)) {
        continue;
      }

      if (model.uniqueFields.some((uf) => uf.includes(field))) {
        continue;
      }

      throw new WsException(
        `"${field}" is not a unique field in model "${modelName}" or it doesn't exist.`,
        'QUERY_INVALID',
      );
    }

    const specifiedFields = this.classifyFields({
      session,
      model: modelName,
      action: 'read',
      fields: Object.keys(flattenWhere),
      classes: {
        scalar: true,
        allowed: true,
        notAllowed: true,
        unknown: true,
      },
    });

    QueryService.checkFieldPermissions(modelName, specifiedFields);

    return flattenWhere;
  }

  private async processMutation<M extends MutationType = MutationType>(
    mutation: Omit<BaseQuery<M>, 'subscribe'>,
    session: Session,
    prisma: PrismaClient,
    parents?: Parent[],
  ): Promise<{ current: Mutation<M>[]; all: Mutation<M>[] }> {
    const model = this.prismaService.models[mutation.model];
    const permissionModel = this.models[mutation.model];
    const modelFields = this.prismaService.fields[mutation.model];

    if (!model || !permissionModel || !modelFields) {
      throw new WsException(
        `You don't have access to model "${mutation.model}" or it doesn't exist.`,
        'PERMISSION_DENIED',
      );
    }

    /** Handle delete mutation */
    if (mutation.type === 'delete' || mutation.type === 'deleteMany') {
      const permission = await QueryService.getActionPermission(
        'delete',
        mutation.model,
        permissionModel,
        session,
      );

      // TODO: Apply permission
      if (mutation.query.where) {
        if (mutation.type === 'delete') {
          this.checkUniqueWhere(mutation.query.where, session, mutation.model);
        } else {
          this.checkWhere(mutation.query.where, session);
        }
      }

      const _delete: Mutation = {
        type: mutation.type,
        target: mutation.model,
        permission: {
          delete: permission,
        },
        oldData: null,
        newData: null,
        query: mutation.query,
        parents,
        model,
      };

      return {
        current: [_delete as Mutation<M>],
        all: [_delete as Mutation<M>],
      };
    }
    /** -------- End -------- */

    type Action = Exclude<ClassifyOptions['action'], 'read' | undefined>;
    type DataObj<T extends Action = Action> = {
      action: T;
      data: Record<string, any>;
      mutation: Mutation<Exclude<MutationType, 'delete' | 'deleteMany'>>;
      permission: Permission<T> | true;
      fields?: ClassifyResult<any>;
    };

    const mutations: Mutation<M>[] = [];
    const dataObjs: DataObj[] = [];
    const classes: ClassifyOptions['classes'] = {
      scalar: true,
      notAllowed: true,
      unknown: true,
      relation: true,
    };

    /** Extract data from mutation */
    if (mutation.type === 'upsert') {
      dataObjs.push({
        action: 'create',
        data: mutation.query.create,
      } as DataObj);

      dataObjs.push({
        action: 'update',
        data: mutation.query.update,
      } as DataObj);
    } else {
      const dataArr = Array.isArray(mutation.query.data)
        ? mutation.query.data
        : [mutation.query.data];

      for (const data of dataArr) {
        dataObjs.push({
          action:
            mutation.type === 'createMany'
              ? 'create'
              : mutation.type === 'updateMany'
              ? 'update'
              : mutation.type,
          data,
        } as DataObj);
      }
    }
    /** -------- End -------- */

    /** Check permission for each data object and classify fields */
    for (const dataObj of dataObjs) {
      dataObj.permission = await QueryService.getActionPermission(
        dataObj.action,
        mutation.model,
        permissionModel,
        session,
      );

      if (!dataObj.data) {
        continue;
      }

      const fields = this.classifyFields({
        session,
        classes,
        action: dataObj.action,
        model: mutation.model,
        fields: Object.keys(dataObj.data),
      });

      // Check fields permissions
      QueryService.checkFieldPermissions(mutation.model, fields);

      dataObj.fields = fields;
    }
    /** -------- End -------- */

    /** Create mutation for each data object */
    if (mutation.type === 'upsert') {
      const createObj = dataObjs.find((obj) => obj.action === 'create');
      const updateObj = dataObjs.find((obj) => obj.action === 'update');

      if (!createObj || !updateObj) {
        throw new Error('Something went wrong, please contact support');
      }

      const query: Record<string, any> = {};

      if (createObj.fields) {
        query.create = pick(createObj.data, createObj.fields.scalar);
      }

      if (updateObj.fields) {
        query.update = pick(updateObj.data, updateObj.fields.scalar);
      }

      // TODO: Apply permission
      if (mutation.query.where) {
        this.checkUniqueWhere(mutation.query.where, session, mutation.model);

        query.where = mutation.query.where;
      }

      const mutationObj: Mutation<'upsert'> = {
        type: 'upsert',
        target: mutation.model,
        permission: {
          create: createObj.permission as Permission<'create'>,
          update: updateObj.permission as Permission<'update'>,
        },
        schema: permissionModel.schema,
        oldData: null,
        newData: null,
        query,
        parents,
        model,
      };

      mutations.push(mutationObj as Mutation<M>);
      createObj.mutation = mutationObj;
      updateObj.mutation = mutationObj;
    } else {
      for (const dataObj of dataObjs) {
        const query: Record<string, any> = {};

        if (dataObj.fields) {
          query.data = pick(dataObj.data, dataObj.fields.scalar);
        }

        if (mutation.query.where) {
          if (mutation.type === 'update') {
            this.checkUniqueWhere(
              mutation.query.where,
              session,
              mutation.model,
            );
          } else if (mutation.type === 'updateMany') {
            this.checkWhere(mutation.query.where, session);
          }

          query.where = mutation.query.where;
        }

        const mutationObj: Mutation<'create' | 'update' | 'updateMany'> = {
          type: mutation.type === 'createMany' ? 'create' : mutation.type,
          target: mutation.model,
          permission: {
            [dataObj.action]: dataObj.permission as Permission<Action>,
          },
          oldData: null,
          newData: null,
          schema: permissionModel.schema,
          query,
          parents,
          model,
        };

        mutations.push(mutationObj as Mutation<M>);
        dataObj.mutation = mutationObj;
      }
    }
    /** -------- End -------- */

    /** Create mutation for each relation */
    for (const dataObj of dataObjs) {
      const mutationObj = dataObj.mutation;
      const data =
        mutationObj.type === 'upsert'
          ? mutationObj.query[dataObj.action]
          : mutationObj.query.data;

      if (!dataObj.fields || !dataObj.data) {
        continue;
      }

      for (const relationField of dataObj.fields.relation) {
        const modelField = modelFields[relationField];
        const fieldData = dataObj.data[relationField];
        const relation = this.analyzeRelation(modelField);
        const relPermModel = this.models[relation.right.target];

        if (!relPermModel) {
          throw new WsException(
            `You don't have access to model "${relation.right.target}" or it doesn't exist.`,
            'PERMISSION_DENIED',
          );
        }

        /** Handle create */
        const creates: Record<string, any>[] = [];

        if (isObject(fieldData.create)) {
          creates.push(
            ...(Array.isArray(fieldData.create)
              ? fieldData.create
              : [fieldData.create]),
          );
        }

        if (isObject(fieldData.createMany) && fieldData.createMany.data) {
          creates.push(
            ...(Array.isArray(fieldData.createMany.data)
              ? fieldData.createMany.data
              : [fieldData.createMany.data]),
          );
        }

        if (relation.right.type !== 'many' && creates.length > 1) {
          throw new WsException(
            `Invalid mutation, "${relationField}" is not a many relation.`,
            'INVALID_MUTATION',
          );
        }

        for (const create of creates) {
          if (!isObject(create)) {
            throw new WsException(
              `Invalid create data for relation "${relationField}"`,
              'QUERY_INVALID',
            );
          }

          if (relation.right.type === 'many') {
            /** One-to-many */
            const _mutations = await this.processMutation(
              {
                type: 'create',
                model: relation.right.target,
                query: {
                  data: create,
                },
              },
              session,
              prisma,
              [
                {
                  mutation: mutationObj,
                  relation,
                },
              ],
            );

            mutations.push(...(_mutations.all as Mutation<M>[]));
          } else {
            /** One-to-one/Many-to-one */
            const _mutations = await this.processMutation(
              {
                type: 'create',
                model: relation.right.target,
                query: {
                  data: create,
                },
              },
              session,
              prisma,
            );

            if (!mutationObj.parents) {
              mutationObj.parents = [];
            }

            mutationObj.parents.push({
              mutation: _mutations.current[0],
              relation,
            });

            // Add parent mutations before the current mutation
            mutations.splice(
              mutations.indexOf(mutationObj as Mutation<M>),
              0,
              ...(_mutations.all as Mutation<M>[]),
            );
          }
          /** -------- End -------- */
        }
        /** -------- End -------- */

        /** Handle connect */
        if (isObject(fieldData.connect)) {
          const connects: Record<string, any>[] = Array.isArray(
            fieldData.connect,
          )
            ? fieldData.connect
            : [fieldData.connect];

          for (const connect of connects) {
            if (!isObject(connect)) {
              throw new WsException(
                `Invalid connect data for relation "${relationField}"`,
                'QUERY_INVALID',
              );
            }

            /** One-to-many or One-to-one where right side is the foreign-key holder */
            if (
              relation.left.type === 'one' &&
              relation.fKeyHolder === relation.right
            ) {
              this.checkUniqueWhere(
                connect,
                session,
                relation.fKeyHolder.target,
              );

              QueryService.checkFieldPermissions(
                relation.fKeyHolder.target,
                this.classifyFields({
                  session,
                  action: 'update',
                  model: relation.fKeyHolder.target,
                  fields: relation.fKeyHolder.fieldsFrom,
                  classes: {
                    scalar: true,
                    notAllowed: true,
                    unknown: true,
                  },
                }),
              );

              const update: Mutation<'update'> = {
                type: 'update',
                model: relation.fKeyHolder.model,
                target: relation.fKeyHolder.target,
                query: {
                  data: {},
                  where: connect,
                },
                parents: [
                  {
                    mutation: mutationObj,
                    relation,
                  },
                ],
                oldData: null,
                newData: null,
                schema: relPermModel.schema,
                permission: {
                  update: QueryService.getActionPermission(
                    'update',
                    relation.fKeyHolder.target,
                    relPermModel,
                    session,
                  ),
                },
              };

              mutations.push(update as Mutation<M>);

              continue;
            }
            /** -------- End -------- */

            /** Many-to-one or One-to-one where left side is the foreign-key holder */
            if (
              relation.left === relation.fKeyHolder &&
              relation.right.type === 'one'
            ) {
              this.checkUniqueWhere(connect, session, relation.right.target);

              QueryService.checkFieldPermissions(
                relation.left.target,
                this.classifyFields({
                  session,
                  action: dataObj.action,
                  model: relation.left.target,
                  fields: relation.fKeyHolder.fieldsFrom,
                  classes: {
                    scalar: true,
                    notAllowed: true,
                  },
                }),
              );

              const query: Record<string, any> = {
                where: connect,
                select: {},
              };

              const length = relation.fKeyHolder.fieldsTo.length;

              for (let i = 0; i < length; i++) {
                const fieldTo = relation.fKeyHolder.fieldsTo[i];
                query.select[fieldTo] = true;
              }

              const oneItem = await (
                prisma[relation.right.target] as any
              ).findUnique(query);

              if (!oneItem) {
                throw new WsException(
                  `Invalid connect data for relation "${relationField}"`,
                  'QUERY_INVALID',
                );
              }

              for (let i = 0; i < length; i++) {
                const fieldTo = relation.fKeyHolder.fieldsTo[i];
                const fieldFrom = relation.fKeyHolder.fieldsFrom[i];

                data[fieldFrom] = oneItem[fieldTo];
              }
            }
            /** -------- End -------- */

            /** Many-to-many
             *
             * Explicit many-to-many is already handled in the above code
             * TODO: Support implicit many-to-many
             *
             * */
          }
        }
        /** -------- End -------- */

        /** Handle connectOrCreate */
        if (isObject(fieldData.connectOrCreate)) {
          const connects: Record<string, any>[] = Array.isArray(
            fieldData.connectOrCreate,
          )
            ? fieldData.connectOrCreate
            : [fieldData.connectOrCreate];

          for (const connectOrCreate of connects) {
            if (!connectOrCreate || connectOrCreate.constructor !== Object) {
              throw new WsException(
                `Invalid connect data for relation "${relationField}"`,
                'QUERY_INVALID',
              );
            }

            /** One-to-many or One-to-one where right side is the foreign-key holder */
            if (
              relation.left.type === 'one' &&
              relation.fKeyHolder === relation.right
            ) {
              const flattenWhere = QueryService.flattenUniqueWhere(
                connectOrCreate.where,
              );

              if (!connectOrCreate.create) {
                connectOrCreate.create = {};
              }

              for (const key of Object.keys(flattenWhere)) {
                if (!relation.fKeyHolder.fieldsFrom.includes(key)) {
                  connectOrCreate.create[key] = flattenWhere[key];
                }
              }

              mutations.push(
                ...(
                  await this.processMutation<M>(
                    {
                      type: 'upsert' as M,
                      model: relation.fKeyHolder.target,
                      query: {
                        create: connectOrCreate.create,
                        where: connectOrCreate.where,
                        update: {},
                      },
                    },
                    session,
                    prisma,
                    [
                      {
                        mutation: mutationObj,
                        relation,
                      },
                    ],
                  )
                ).all,
              );

              continue;
            }
            /** -------- End -------- */

            /** Many-to-one or One-to-one where left side is the foreign-key holder */
            if (
              relation.left === relation.fKeyHolder &&
              relation.right.type === 'one'
            ) {
              this.checkUniqueWhere(
                connectOrCreate,
                session,
                relation.right.target,
              );

              QueryService.checkFieldPermissions(
                relation.left.target,
                this.classifyFields({
                  session,
                  action: dataObj.action,
                  model: relation.left.target,
                  fields: relation.fKeyHolder.fieldsFrom,
                  classes: {
                    scalar: true,
                    notAllowed: true,
                    unknown: true,
                  },
                }),
              );

              const query: Record<string, any> = {
                where: connectOrCreate.where,
                select: {},
              };

              const length = relation.fKeyHolder.fieldsTo.length;

              for (let i = 0; i < length; i++) {
                const fieldTo = relation.fKeyHolder.fieldsTo[i];
                query.select[fieldTo] = true;
              }

              const oneItem = await (
                prisma[relation.right.target] as any
              ).findUnique(query);

              if (oneItem) {
                for (let i = 0; i < length; i++) {
                  const fieldTo = relation.fKeyHolder.fieldsTo[i];
                  const fieldFrom = relation.fKeyHolder.fieldsFrom[i];

                  data[fieldFrom] = oneItem[fieldTo];
                }
              } else {
                if (!connectOrCreate.create) {
                  connectOrCreate.create = {};
                }

                const _mutations = await this.processMutation(
                  {
                    type: 'create',
                    model: relation.right.target,
                    query: {
                      data: connectOrCreate.create,
                    },
                  },
                  session,
                  prisma,
                );

                if (!mutationObj.parents) {
                  mutationObj.parents = [];
                }

                mutationObj.parents.push({
                  mutation: _mutations.current[0],
                  relation,
                });

                // Add parent mutations before the current mutation
                mutations.splice(
                  mutations.indexOf(mutationObj as Mutation<M>),
                  0,
                  ...(_mutations.all as Mutation<M>[]),
                );
              }
            }
            /** -------- End -------- */

            /** Many-to-many
             *
             * Explicit many-to-many is already handled in the above code
             * TODO: Support implicit many-to-many
             *
             * */
          }
        }
        /** -------- End -------- */

        /** Handle disconnect/set */
        if (!relation.left.field.isRequired) {
          /** Disconnect */
          if (
            fieldData.disconnect === true &&
            relation.left === relation.fKeyHolder
          ) {
            for (const fieldFrom of relation.fKeyHolder.fieldsFrom) {
              data[fieldFrom] = null;
            }
          } else if (isObject(fieldData.disconnect)) {
            const disconnects: Record<string, any>[] = Array.isArray(
              fieldData.disconnect,
            )
              ? fieldData.disconnect
              : [fieldData.disconnect];

            for (const disconnect of disconnects) {
              if (!disconnect || disconnect.constructor !== Object) {
                throw new WsException(
                  `Invalid disconnect data for relation "${relationField}"`,
                  'QUERY_INVALID',
                );
              }

              // TODO: Apply permission
              this.checkUniqueWhere(disconnect, session, relation.right.target);

              QueryService.checkFieldPermissions(
                relation.left.target,
                this.classifyFields({
                  session,
                  action: 'update',
                  model: relation.fKeyHolder.target,
                  fields: relation.fKeyHolder.fieldsFrom,
                  classes: {
                    scalar: true,
                    notAllowed: true,
                    unknown: true,
                  },
                }),
              );

              const query: Record<string, any> = {
                where: disconnect,
                data: {},
              };

              for (const fieldFrom of relation.fKeyHolder.fieldsFrom) {
                query.data[fieldFrom] = null;
              }

              const update: Mutation<'update'> = {
                query,
                type: 'update',
                model: relation.fKeyHolder.model,
                target: relation.fKeyHolder.target,
                parents: [
                  {
                    mutation: mutationObj,
                    relation,
                  },
                ],
                newData: null,
                oldData: null,
                schema: relPermModel.schema,
                permission: {
                  update: QueryService.getActionPermission(
                    'update',
                    relation.fKeyHolder.target,
                    relPermModel,
                    session,
                  ),
                },
              };

              mutations.push(update as Mutation<M>);
            }
          }
          /** --- End --- */

          /** Set */
          if (
            Array.isArray(fieldData.set) &&
            relation.right === relation.fKeyHolder
          ) {
            QueryService.checkFieldPermissions(
              relation.right.target,
              this.classifyFields({
                session,
                action: 'update',
                model: relation.right.target,
                fields: relation.fKeyHolder.fieldsFrom,
                classes: {
                  scalar: true,
                  notAllowed: true,
                  unknown: true,
                },
              }),
            );

            const permission = QueryService.getActionPermission(
              'update',
              relation.right.target,
              relPermModel,
              session,
            );

            const disconnectQuery: Record<string, any> = {
              where: {},
              data: {},
            };

            for (const fieldFrom of relation.fKeyHolder.fieldsFrom) {
              disconnectQuery.data[fieldFrom] = null;
            }

            mutations.push({
              model: relation.right.model,
              target: relation.right.target,
              type: 'updateMany',
              newData: null,
              oldData: null,
              parents: [
                {
                  mutation: mutationObj,
                  relation,
                },
              ],
              schema: relPermModel.schema,
              permission: {
                update: permission,
              },
              query: disconnectQuery,
            } as Mutation<M>);

            for (const set of fieldData.set) {
              if (!set || set.constructor !== Object) {
                throw new WsException(
                  `Invalid set data for relation "${relationField}"`,
                  'QUERY_INVALID',
                );
              }

              this.checkUniqueWhere(set, session, relation.right.target);

              mutations.push({
                model: relation.right.model,
                target: relation.right.target,
                type: 'update' as M,
                newData: null,
                oldData: null,
                parents: [
                  {
                    mutation: mutationObj,
                    relation,
                  },
                ],
                schema: relPermModel.schema,
                permission: {
                  update: permission,
                },
                query: {
                  where: set,
                  data: {},
                },
              });
            }
          } else if (fieldData.set !== undefined) {
            throw new WsException(
              `Invalid set data for relation "${relationField}"`,
              'QUERY_INVALID',
            );
          }
          /** --- End --- */
        } else if (fieldData.disconnect || fieldData.set) {
          throw new WsException(
            `Cannot disconnect relation "${relationField}" because it is required`,
            'QUERY_INVALID',
          );
        }
        /** -------- End -------- */

        /** Handle update */
        if (fieldData.update) {
          const updates = Array.isArray(fieldData.update)
            ? fieldData.update
            : [fieldData.update];

          for (const update of updates) {
            if (!update || update.constructor !== Object) {
              throw new WsException(
                `Invalid update data for relation "${relationField}"`,
                'QUERY_INVALID',
              );
            }

            let query: Record<string, any> = {};

            if (relation.right.type === 'many') {
              query = update;
            } else {
              query.data = update;
            }

            if (relation.right.type === 'many' && !query.where) {
              query.where = {};
            }

            const _mutations = await this.processMutation<M>(
              {
                model: relation.right.target,
                type: 'update' as M,
                query,
              },

              session,
              prisma,
              [
                {
                  mutation: mutationObj,
                  relation,
                },
              ],
            );

            mutations.push(..._mutations.all);
          }
        }
        /** -------- End -------- */

        /** Handle upsert */
        if (fieldData.upsert) {
          const upserts = Array.isArray(fieldData.upsert)
            ? fieldData.upsert
            : [fieldData.upsert];

          for (const upsert of upserts) {
            if (!upsert || upsert.constructor !== Object) {
              throw new WsException(
                `Invalid upsert data for relation "${relationField}"`,
                'QUERY_INVALID',
              );
            }

            let query: Record<string, any> = {};

            if (relation.right.type === 'many') {
              query = upsert;
            } else {
              query.update = upsert.update;
              query.create = upsert.create;
            }

            if (relation.right.type === 'many' && !query.where) {
              query.where = {};
            }

            if (!query.create) {
              query.create = {};
            }

            if (!query.update) {
              query.update = {};
            }

            const _mutations = await this.processMutation<M>(
              {
                model: relation.right.target,
                type: 'upsert' as M,
                query,
              },

              session,
              prisma,
              [
                {
                  mutation: mutationObj,
                  relation,
                },
              ],
            );

            mutations.push(..._mutations.all);
          }
        }
        /** -------- End -------- */

        /** Handle updateMany */
        if (relation.right.type === 'many' && fieldData.updateMany) {
          const updates = Array.isArray(fieldData.updateMany)
            ? fieldData.updateMany
            : [fieldData.updateMany];

          for (const update of updates) {
            if (!update || update.constructor !== Object) {
              throw new WsException(
                `Invalid updateMany data for relation "${relationField}"`,
                'QUERY_INVALID',
              );
            }

            const _mutations = await this.processMutation<M>(
              {
                model: relation.right.target,
                type: 'updateMany' as M,
                query: update,
              },

              session,
              prisma,
              [
                {
                  mutation: mutationObj,
                  relation,
                },
              ],
            );

            mutations.push(..._mutations.all);
          }
        } else if (fieldData.updateMany) {
          throw new WsException(
            `Cannot updateMany relation "${relationField}"`,
            'QUERY_INVALID',
          );
        }
        /** -------- End -------- */

        /** Handle delete */
        if (!relation.left.field.isRequired && fieldData.delete) {
          const deletes = Array.isArray(fieldData.delete)
            ? fieldData.delete
            : [fieldData.delete];

          for (const deleteData of deletes) {
            if (!deleteData || deleteData.constructor !== Object) {
              throw new WsException(
                `Invalid delete data for relation "${relationField}"`,
                'QUERY_INVALID',
              );
            }

            const _mutations = await this.processMutation<M>(
              {
                model: relation.right.target,
                type: 'delete' as M,
                query: {
                  where: deleteData,
                },
              },

              session,
              prisma,
              [
                {
                  mutation: mutationObj,
                  relation,
                },
              ],
            );

            mutations.push(..._mutations.all);
          }
        } else if (fieldData.delete) {
          throw new WsException(
            `Cannot delete required relation "${relationField}"`,
            'QUERY_INVALID',
          );
        }
        /** -------- End -------- */

        /** Handle deleteMany */
        if (relation.right.type === 'many' && fieldData.deleteMany) {
          const deletes = Array.isArray(fieldData.deleteMany)
            ? fieldData.deleteMany
            : [fieldData.deleteMany];

          for (const deleteData of deletes) {
            if (!deleteData || deleteData.constructor !== Object) {
              throw new WsException(
                `Invalid deleteMany data for relation "${relationField}"`,
                'QUERY_INVALID',
              );
            }

            const _mutations = await this.processMutation<M>(
              {
                model: relation.right.target,
                type: 'deleteMany' as M,
                query: {
                  where: deleteData,
                },
              },

              session,
              prisma,
              [
                {
                  mutation: mutationObj,
                  relation,
                },
              ],
            );

            mutations.push(..._mutations.all);
          }
        } else if (fieldData.deleteMany) {
          throw new WsException(
            `Cannot deleteMany relation "${relationField}"`,
            'QUERY_INVALID',
          );
        }
        /** -------- End -------- */
      }
    }
    /** -------- End -------- */

    return {
      all: mutations,
      current: (mutation.type === 'upsert'
        ? [dataObjs[0].mutation]
        : dataObjs.map((d) => d.mutation)) as Mutation<M>[],
    };
  }

  private static validateSchema(mutation: Mutation<'create' | 'update'>): void {
    if (mutation.schema) {
      const validation = mutation.schema.validate(mutation.query.data, {
        abortEarly: true,
      });

      if (validation.error) {
        throw new WsException(validation.error.message, 'VALIDATION_FAILED');
      }
    }
  }

  private async applyPreset(
    mutation: Mutation<'create' | 'update'>,
    session: Session,
  ): Promise<void> {
    const permission = mutation.permission[mutation.type];

    if (permission && permission !== true) {
      if (typeof permission.preset === 'function') {
        merge(
          mutation.query.data,
          await permission.preset(session, mutation.query, this.moduleRef),
        );
      } else if (typeof permission.preset === 'object') {
        merge(mutation.query.data, permission.preset);
      }
    }
  }

  private async applyValidation(
    mutation: Mutation<'create' | 'update'>,
    session: Session,
    trx: TransactionClient,
  ) {
    const permission = mutation.permission[mutation.type];

    if (permission && permission !== true && permission.validation) {
      let validationQuery: Record<string, any> | boolean;

      if (typeof permission.validation === 'function') {
        validationQuery = await permission.validation(
          session,
          mutation.query,
          this.moduleRef,
        );
      } else {
        validationQuery = permission.validation;
      }

      if (!validationQuery) {
        throw new WsException(
          `Validation failed for model "${mutation.target}" while creating`,
          'VALIDATION_FAILED',
        );
      }

      if (validationQuery !== true) {
        const item = await (trx[mutation.target] as any).findFirst({
          where: {
            AND: [
              pick(mutation.newData, mutation.model.primaryKey),
              validationQuery.where,
            ],
          },
        });

        if (!item) {
          throw new WsException(
            `Validation failed for model "${mutation.target}" while creating`,
            'VALIDATION_FAILED',
          );
        }
      }
    }
  }

  private async findItemToMutate(
    mutation: Mutation<'delete' | 'update'>,
    session: Session,
    trx: TransactionClient,
  ): Promise<void> {
    const findQuery: Record<string, any> = {
      where: {
        AND: [],
      },
    };

    if (mutation.query.where) {
      findQuery.where.AND.push(
        QueryService.flattenUniqueWhere(mutation.query.where),
      );
    }

    if (mutation.parents) {
      for (const parent of mutation.parents) {
        const where: Record<string, any> = {};
        const length = parent.relation.fKeyHolder.fieldsFrom.length;

        if (parent.relation.right === parent.relation.fKeyHolder) {
          for (let i = 0; i < length; i++) {
            where[parent.relation.fKeyHolder.fieldsFrom[i]] =
              parent.mutation.newData?.[parent.relation.fKeyHolder.fieldsTo[i]];
          }
        } else {
          for (let i = 0; i < length; i++) {
            where[parent.relation.fKeyHolder.fieldsTo[i]] =
              parent.mutation.newData?.[
                parent.relation.fKeyHolder.fieldsFrom[i]
              ];
          }
        }

        findQuery.where.AND.push(where);
      }
    }

    // Apply permission
    const permission = mutation.permission[mutation.type];

    if (permission && permission !== true && permission.permission) {
      if (typeof permission.permission === 'function') {
        const permissionQuery = await permission.permission(
          session,
          mutation.query,
          this.moduleRef,
        );

        if (!permissionQuery) {
          throw new WsException(
            `You don't have permission to do a "${mutation.type}" on model "${mutation.target}"`,
            'PERMISSION_DENIED',
          );
        }

        if (permissionQuery !== true) {
          findQuery.where.AND.push(
            await permission.permission(
              session,
              mutation.query,
              this.moduleRef,
            ),
          );
        }
      } else {
        findQuery.where.AND.push(permission.permission);
      }
    }

    mutation.oldData = await (trx[mutation.target] as any).findFirst(findQuery);

    if (mutation.oldData) {
      mutation.query.where = {};
      let where: Record<string, any> = mutation.query.where;

      if (mutation.model.primaryKey.length > 1) {
        where = {};
        mutation.query.where[mutation.model.primaryKey.join('_')] = where;
      }

      for (const key of mutation.model.primaryKey) {
        where[key] = mutation.oldData[key];
      }
    }
  }

  public async find(
    rootQuery: BaseQuery<QueryType>,
    session: Session,
    trx?: PrismaClient,
  ): Promise<any> {
    const queue: BaseQuery[] = [rootQuery];

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

    const prisma = trx ?? (await this.prismaService.getPrisma(session.iid));

    if (!prisma) {
      throw new WsException(
        `Institute #${session.iid} is either not found or not active`,
        'UNAUTHORIZED',
      );
    }

    try {
      return await (prisma[rootQuery.model][rootQuery.type] as any)(
        rootQuery.query,
      );
    } catch (e) {
      throw new WsException(
        'Something went wrong while executing query, please contact support',
        'PRISMA_ERROR',
      );
    }
  }

  public async create(
    mutation: Mutation<'create'>,
    session: Session,
    trx: TransactionClient,
  ): Promise<void> {
    // Apply joi validation
    QueryService.validateSchema(mutation);

    // Apply presets
    await this.applyPreset(mutation, session);

    if (mutation.parents) {
      for (const parent of mutation.parents) {
        const length = parent.relation.fKeyHolder.fieldsFrom.length;

        for (let i = 0; i < length; i++) {
          mutation.query.data[parent.relation.fKeyHolder.fieldsFrom[i]] =
            parent.mutation.newData?.[parent.relation.fKeyHolder.fieldsTo[i]];
        }
      }
    }

    mutation.newData = await (trx[mutation.target] as any).create(
      mutation.query,
    );

    // Apply validation
    await this.applyValidation(mutation, session, trx);

    const eventPayload = pick(mutation, 'newData', 'oldData', 'target', 'type');
    (eventPayload as any).session = session;
    this.eventEmitter.emitAsync(`${mutation.target}.create`, eventPayload);
  }

  public async update(
    mutation: Mutation<'update'>,
    session: Session,
    trx: TransactionClient,
  ): Promise<void> {
    // Apply joi validation
    QueryService.validateSchema(mutation);

    // Apply presets
    await this.applyPreset(mutation, session);

    // Find item to update
    await this.findItemToMutate(mutation, session, trx);

    if (!mutation.oldData) {
      return;
    }

    mutation.newData = await (trx[mutation.target] as any).update(
      mutation.query,
    );

    // Apply validation
    await this.applyValidation(mutation, session, trx);

    const eventPayload = pick(mutation, 'newData', 'oldData', 'target', 'type');
    (eventPayload as any).session = session;
    this.eventEmitter.emitAsync(`${mutation.target}.update`, eventPayload);
  }

  public async delete(
    mutation: Mutation<'delete'>,
    session: Session,
    trx: TransactionClient,
  ): Promise<void> {
    // Find item to update
    await this.findItemToMutate(mutation, session, trx);

    if (!mutation.oldData) {
      return;
    }

    await (trx[mutation.target] as any).delete(mutation.query);

    const eventPayload = pick(mutation, 'newData', 'oldData', 'target', 'type');
    (eventPayload as any).session = session;
    this.eventEmitter.emitAsync(`${mutation.target}.delete`, eventPayload);
  }

  public async upsert(
    mutation: Mutation<'upsert'>,
    session: Session,
    trx: TransactionClient,
  ) {
    // TODO: Implement upsert
  }

  public async createMany(
    mutation: Mutation<'createMany'>,
    session: Session,
    trx: TransactionClient,
  ) {
    // TODO: Implement createMany
  }

  public async updateMany(
    mutation: Mutation<'updateMany'>,
    session: Session,
    trx: TransactionClient,
  ) {
    // TODO: Implement updateMany
  }

  public async deleteMany(
    mutation: Mutation<'deleteMany'>,
    session: Session,
    trx: TransactionClient,
  ) {
    // TODO: Implement updateMany
  }

  public async mutate(
    mutation: Omit<BaseQuery<MutationType>, 'subscribe'>,
    session: Session,
  ): Promise<any> {
    let select: Record<string, any> | null = null;

    if (mutation.query.select) {
      // Process select and include
      const selectQueue: BaseQuery[] | null = [mutation];

      for (let q = 0; q < selectQueue.length; q++) {
        const baseQuery = selectQueue[q];
        const modelFields = this.prismaService.fields[baseQuery.model];
        const permissionModel = this.models[baseQuery.model];

        if (!modelFields || !permissionModel) {
          // Permission for this model is not defined
          throw new WsException(
            `You don't have access to model "${baseQuery.model}" or it doesn't exist.`,
            'PERMISSION_DENIED',
          );
        }

        if (baseQuery.query.select) {
          this.processSelect(selectQueue, baseQuery, session, modelFields);
        } else {
          // Add default fields to select
          this.addDefaultSelects(selectQueue, baseQuery, session, modelFields);
        }
      }

      // Backup root query's selections
      select = mutation.query.select;
      delete mutation.query.select;
    }

    // Acquire prisma client
    const prisma = await this.prismaService.getPrisma(session.iid);

    if (!prisma) {
      throw new WsException(
        `Institute #${session.iid} is either not found or not active`,
        'UNAUTHORIZED',
      );
    }

    const mutations = await this.processMutation<MutationType>(
      mutation,
      session,
      prisma,
    );

    if (
      select &&
      (mutation.type === 'delete' || mutation.type === 'deleteMany')
    ) {
      for (const mutation of mutations.current) {
        mutation.select = select;
      }
    }

    if (mutation.type === 'deleteMany' || mutation.type === 'updateMany') {
      return await prisma.$transaction(
        async (trx) => await this[mutation.type](mutation as any, session, trx),
      );
    }

    await prisma.$transaction(async (trx) => {
      for (const mutation of mutations.all) {
        await this[mutation.type](mutation as any, session, trx);
      }
    });

    if (mutation.type === 'delete') {
      if (!mutations.current[0].oldData) {
        throw new WsException(
          `Item to delete is not found`,
          'RECORD_NOT_FOUND',
        );
      }

      return mutations.current[0].oldData;
    }

    if (!select) {
      if (mutation.type === 'createMany') {
        return mutations.current.map((m) => m.newData);
      }

      return mutations.current[0].newData;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const model = this.prismaService.models[mutation.model]!;
    const query: Record<string, any> = {
      where: {},
      select,
    };

    if (mutation.type === 'createMany') {
      query.where.OR = [];

      for (const m of mutations.current) {
        query.where.OR.push(pick(m.newData, model.primaryKey));
      }

      return await (prisma[mutation.model] as any).findMany(query);
    }

    query.where = pick(mutations.current[0].newData, model.primaryKey);
    return await (prisma[mutation.model] as any).findFirst(query);
  }
}
