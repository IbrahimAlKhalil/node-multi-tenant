import { PermissionDefinition as UpdatePermission } from './types/update-permission';
import { PermissionDefinition as DeletePermission } from './types/delete-permission';
import { PermissionDefinition as CreatePermission } from './types/create-permission';
import { PermissionDefinition as ReadPermission } from './types/read-permission';
import { FKeyHolder, Relation, RelationAnalyzed } from './types/relation';
import { MutationSchema, MutationType } from './schema/mutation-schema';
import { PrismaService } from '../prisma/prisma.service.js';
import { WsException } from '../exceptions/ws-exception.js';
import { ClassifyOptions } from './types/classify-options';
import { Prisma, PrismaClient } from '../../prisma/client';
import { ClassifyResult } from './types/classify-result';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuerySchema } from './schema/query-schema';
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
import { WsSub } from '../uws/ws-sub.js';
import isEmpty from 'lodash/isEmpty.js';
import merge from 'lodash/merge.js';
import { fileURLToPath } from 'url';
import pick from 'lodash/pick.js';
import fs from 'fs/promises';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type Permission<T extends keyof Actions<any>> = T extends 'read'
  ? ReadPermission<any>
  : T extends 'create'
  ? CreatePermission<any>
  : T extends 'update'
  ? UpdatePermission<any>
  : T extends 'delete'
  ? DeletePermission<any>
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
  public models: Partial<Record<ModelNames, Model<ModelNames>>> = {};
  public i18nModels: Partial<
    Record<ModelNames, { name: ModelNames; model: Model<ModelNames> }>
  > = {};
  private orderByNestedFields = ['_count', '_sum', '_avg', '_min', '_max'];

  private async classifyFields<O extends ClassifyOptions>(
    options: O,
  ): Promise<ClassifyResult<O>> {
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
          const permission = await this.getActionPermission(
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
    const permission = await this.getActionPermission(
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

  private async getActionPermission<T extends keyof Actions<any, any>>(
    action: T,
    modelName: ModelNames,
    permissionModel: Model<ModelNames>,
    session: Session,
  ): Promise<Permission<T> | true> {
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

    if (session.knd === 'STAFF' && action !== 'subscribe') {
      const rolePermission = await this.prismaService.getRolePermissions(
        session.iid,
      );

      const checker = (role: number) => {
        const rp = rolePermission.get(role);
        const rpm = rp?.[modelName];

        return (
          !rp || !rpm || !rpm[action as 'read' | 'create' | 'update' | 'delete']
        );
      };

      if (!session.rol.some(checker)) {
        throw new WsException(
          `You don't have permission to perform action "${action}" on model "${modelName}".`,
          'PERMISSION_DENIED',
        );
      }
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

  private async addDefaultSelects(
    queue: (MutationSchema | QuerySchema)[],
    baseQuery: MutationSchema | QuerySchema,
    session: Session,
    modelFields: Record<string, Field>,
  ): Promise<void> {
    // User did not specify any fields to select, so we will select default fields
    baseQuery.query.select = {};

    // Add included fields to queue if exists
    if (baseQuery.query.include) {
      const fields = await this.classifyFields({
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
        });
      }
    }

    const fields = await this.classifyFields({
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

  private async addDefaultCountSelects(
    baseQuery: MutationSchema | QuerySchema,
    session: Session,
  ): Promise<void> {
    const fields = await this.classifyFields({
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

  private async checkCountSelects(
    baseQuery: MutationSchema | QuerySchema,
    session: Session,
  ): Promise<void> {
    const fields = await this.classifyFields({
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

  private async checkWhere(
    rootWhere: { model: ModelNames; where: Record<string, any> },
    session: Session,
  ): Promise<void> {
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

      const specifiedFields = await this.classifyFields({
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
    baseQuery: QuerySchema | MutationSchema,
    permissionModel: Model<any, any>,
  ): Promise<boolean> {
    const permission = await this.getActionPermission(
      action,
      baseQuery.model,
      permissionModel,
      session,
    );

    if (permission === true) {
      return true;
    }

    if (!permission.permission) {
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

    if (!baseWhere) {
      baseQuery.query.where = permissionQuery;
      return true;
    }

    baseQuery.query.where = {
      AND: [permissionQuery, baseWhere],
    };

    return true;
  }

  private async checkOrderBy(
    baseQuery: QuerySchema,
    session: Session,
  ): Promise<void> {
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

      const fields = await this.classifyFields({
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

  private async processSelect(
    queue: (MutationSchema | QuerySchema)[],
    baseQuery: MutationSchema | QuerySchema,
    session: Session,
    modelFields: Record<string, Field>,
  ): Promise<void> {
    // Classify fields
    const fields = await this.classifyFields({
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
        await this.addDefaultCountSelects(baseQuery, session);
      } else if (typeof countQuery === 'object' && !Array.isArray(countQuery)) {
        if (isEmpty(countQuery.select)) {
          await this.addDefaultCountSelects(baseQuery, session);
        } else {
          await this.checkCountSelects(baseQuery, session);
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

  private async checkUniqueWhere(
    where: Record<string, any>,
    session: Session,
    modelName: ModelNames,
  ): Promise<Record<string, any>> {
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

    const specifiedFields = await this.classifyFields({
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

  private async applyPreset(
    mutation: Mutation<'create' | 'update' | 'updateMany' | 'upsert'>,
    session: Session,
  ): Promise<void> {
    const createPermission = mutation.permission.create;
    const updatePermission = mutation.permission.update;
    const createData =
      mutation.type === 'upsert' ? mutation.query.create : mutation.query.data;
    const updateData =
      mutation.type === 'upsert' ? mutation.query.update : mutation.query.data;

    if (createPermission && createPermission !== true) {
      if (typeof createPermission.preset === 'function') {
        merge(
          createData,
          await createPermission.preset(session, createData, this.moduleRef),
        );
      } else if (typeof createPermission.preset === 'object') {
        merge(createData, createPermission.preset);
      }
    }

    if (updatePermission && updatePermission !== true) {
      if (typeof updatePermission.preset === 'function') {
        merge(
          updateData,
          await updatePermission.preset(session, updateData, this.moduleRef),
        );
      } else if (typeof updatePermission.preset === 'object') {
        merge(updateData, updatePermission.preset);
      }
    }
  }

  private async applyValidation(
    mutation: Mutation<'create' | 'update' | 'upsert'>,
    session: Session,
    trx: PrismaClient | TransactionClient,
  ): Promise<void> {
    const permission =
      mutation.type === 'create' || mutation.type === 'update'
        ? mutation.permission[mutation.type]
        : !mutation.oldData
        ? mutation.permission.create
        : mutation.permission.update;

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
              validationQuery,
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

  private static async findItemToMutate(
    mutation: Mutation<'delete' | 'update' | 'upsert'>,
    trx: PrismaClient | TransactionClient,
  ): Promise<void> {
    const findQuery: Record<string, any> = {
      where: {
        AND: [],
      },
    };

    if (mutation.query.where) {
      findQuery.where.AND.push(mutation.query.where);
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

  private static connectMutationParent(
    mutation: Mutation<'create' | 'upsert'>,
  ): void {
    if (mutation.parents) {
      const data =
        mutation.type === 'upsert'
          ? mutation.query.create
          : mutation.query.data;

      for (const parent of mutation.parents) {
        const length = parent.relation.fKeyHolder.fieldsFrom.length;

        for (let i = 0; i < length; i++) {
          data[parent.relation.fKeyHolder.fieldsFrom[i]] =
            parent.mutation.newData?.[parent.relation.fKeyHolder.fieldsTo[i]];
        }
      }
    }
  }

  private static validateMutationData(
    mutation: Mutation<'create' | 'upsert'>,
  ): void {
    if (mutation.schema) {
      const data: Record<string, any> =
        mutation.type === 'upsert'
          ? mutation.query.create
          : mutation.query.data;

      const validation = mutation.schema.validate(data, {
        abortEarly: true,
        allowUnknown: true,
      });

      if (validation.error) {
        throw new WsException(validation.error.message, 'VALIDATION_FAILED');
      }
    }
  }

  private async processMutation<M extends MutationType = MutationType>(
    mutation: MutationSchema<M>,
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
      const permission = await this.getActionPermission(
        'delete',
        mutation.model,
        permissionModel,
        session,
      );

      if (mutation.query.where) {
        if (mutation.type === 'delete') {
          mutation.query.where = await this.checkUniqueWhere(
            mutation.query.where,
            session,
            mutation.model,
          );
        } else {
          await this.checkWhere(
            {
              model: mutation.model,
              where: mutation.query.where,
            },
            session,
          );
        }
      }

      await this.applyPermissions('delete', session, mutation, permissionModel);

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
      dataObj.permission = await this.getActionPermission(
        dataObj.action,
        mutation.model,
        permissionModel,
        session,
      );

      if (!dataObj.data) {
        continue;
      }

      const fields = await this.classifyFields({
        session,
        classes,
        action: dataObj.action,
        model: mutation.model,
        fields: Object.keys(dataObj.data),
      });

      if (mutation.type === 'updateMany' && fields.relation.length) {
        throw new WsException(
          'You can not update relations in updateMany mutation',
          'PERMISSION_DENIED',
        );
      }

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

      // Check where
      if (mutation.query.where) {
        mutation.query.where = await this.checkUniqueWhere(
          mutation.query.where,
          session,
          mutation.model,
        );

        query.where = mutation.query.where;
      }

      // Apply permission
      await this.applyPermissions('update', session, mutation, permissionModel);

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

      // Validate schema
      QueryService.validateMutationData(mutationObj);

      // Apply preset
      await this.applyPreset(mutationObj, session);

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
            mutation.query.where = await this.checkUniqueWhere(
              mutation.query.where,
              session,
              mutation.model,
            );
          } else if (mutation.type === 'updateMany') {
            await this.checkWhere(
              {
                model: mutation.model,
                where: mutation.query.where,
              },
              session,
            );
          }

          query.where = mutation.query.where;
        }

        // Apply permission
        if (mutation.type === 'update' || mutation.type === 'updateMany') {
          await this.applyPermissions(
            'update',
            session,
            mutation,
            permissionModel,
          );
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

        if (mutationObj.type === 'create') {
          // Validate schema
          QueryService.validateMutationData(mutationObj as Mutation<'create'>);
        }

        // Apply preset
        await this.applyPreset(mutationObj, session);

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
              relation.right === relation.fKeyHolder
                ? [
                    {
                      mutation: mutationObj,
                      relation,
                    },
                  ]
                : undefined,
            );

            if (relation.right === relation.fKeyHolder) {
              mutations.push(...(_mutations.all as Mutation<M>[]));
            } else {
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
              const flattenWhere = await this.checkUniqueWhere(
                connect,
                session,
                relation.fKeyHolder.target,
              );

              QueryService.checkFieldPermissions(
                relation.fKeyHolder.target,
                await this.classifyFields({
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

              const mutationSchema: MutationSchema = {
                type: 'update',
                model: relation.fKeyHolder.target,
                query: {
                  data: {},
                  where: flattenWhere,
                },
              };

              // Apply permission
              await this.applyPermissions(
                'update',
                session,
                mutationSchema,
                relPermModel,
              );

              const update: Mutation<'update'> = {
                type: 'update',
                model: relation.fKeyHolder.model,
                target: relation.fKeyHolder.target,
                query: mutationSchema.query,
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
                  update: await this.getActionPermission(
                    'update',
                    relation.fKeyHolder.target,
                    relPermModel,
                    session,
                  ),
                },
              };

              // Apply preset
              await this.applyPreset(update, session);

              mutations.push(update as Mutation<M>);

              continue;
            }
            /** -------- End -------- */

            /** Many-to-one or One-to-one where left side is the foreign-key holder */
            if (
              relation.left === relation.fKeyHolder &&
              relation.right.type === 'one'
            ) {
              await this.checkUniqueWhere(
                connect,
                session,
                relation.right.target,
              );

              QueryService.checkFieldPermissions(
                relation.left.target,
                await this.classifyFields({
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
              await this.checkUniqueWhere(
                connectOrCreate,
                session,
                relation.right.target,
              );

              QueryService.checkFieldPermissions(
                relation.left.target,
                await this.classifyFields({
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

              const flattenWhere = await this.checkUniqueWhere(
                disconnect,
                session,
                relation.right.target,
              );

              QueryService.checkFieldPermissions(
                relation.left.target,
                await this.classifyFields({
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

              const mutationSchema: MutationSchema = {
                type: 'update',
                model: relation.fKeyHolder.target,
                query: {
                  where: flattenWhere,
                  data: {},
                },
              };

              // Apply permission
              await this.applyPermissions(
                'update',
                session,
                mutationSchema,
                relPermModel,
              );

              for (const fieldFrom of relation.fKeyHolder.fieldsFrom) {
                mutationSchema.query.data[fieldFrom] = null;
              }

              const update: Mutation<'update'> = {
                query: mutationSchema.query,
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
                  update: await this.getActionPermission(
                    'update',
                    relation.fKeyHolder.target,
                    relPermModel,
                    session,
                  ),
                },
              };

              // Apply preset
              await this.applyPreset(update, session);

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
              await this.classifyFields({
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

            const permission = await this.getActionPermission(
              'update',
              relation.right.target,
              relPermModel,
              session,
            );

            const mutationSchema: MutationSchema = {
              type: 'update',
              model: relation.right.target,
              query: {
                where: {},
                data: {},
              },
            };

            for (const fieldFrom of relation.fKeyHolder.fieldsFrom) {
              mutationSchema.query.data[fieldFrom] = null;
            }

            // Apply permission
            await this.applyPermissions(
              'update',
              session,
              mutationSchema,
              relPermModel,
            );

            const updateMany: Mutation<'updateMany'> = {
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
              query: mutationSchema.query,
            };

            // Apply preset
            await this.applyPreset(updateMany, session);

            mutations.push(updateMany as Mutation<M>);

            for (const set of fieldData.set) {
              if (!set || set.constructor !== Object) {
                throw new WsException(
                  `Invalid set data for relation "${relationField}"`,
                  'QUERY_INVALID',
                );
              }

              const flattenWhere = await this.checkUniqueWhere(
                set,
                session,
                relation.right.target,
              );

              const mutationSchema: MutationSchema = {
                type: 'update',
                model: relation.right.target,
                query: {
                  where: flattenWhere,
                  data: {},
                },
              };

              // Apply permission
              await this.applyPermissions(
                'update',
                session,
                mutationSchema,
                relPermModel,
              );

              const update: Mutation<'update'> = {
                model: relation.right.model,
                target: relation.right.target,
                type: 'update',
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
                query: mutationSchema.query,
              };

              // Apply preset
              await this.applyPreset(update, session);

              mutations.push(update as Mutation<M>);
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

            if (!upsert.create) {
              upsert.create = {};
            }

            if (!upsert.update) {
              upsert.update = {};
            }

            /** One-to-many or One-to-one where right side is the foreign-key holder */
            if (
              relation.left.type === 'one' &&
              relation.fKeyHolder === relation.right
            ) {
              if (!upsert.where) {
                upsert.where = {};
              }

              const _mutations = await this.processMutation<M>(
                {
                  model: relation.right.target,
                  type: 'upsert' as M,
                  query: upsert,
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
            } else {
              /** One-to-one/Many-to-one */

              delete upsert.where;

              const _mutations = await this.processMutation(
                {
                  model: relation.right.target,
                  type: 'upsert',
                  query: upsert,
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
        if (fieldData.delete) {
          if (
            relation.left === relation.fKeyHolder &&
            relation.left.field.isRequired
          ) {
            throw new WsException(
              `Cannot delete relation "${relationField}" because it is required`,
              'QUERY_INVALID',
            );
          }

          // TODO: Handle circular relations

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

  public async find(rootQuery: QuerySchema, session: Session): Promise<any> {
    const queue: QuerySchema[] = [rootQuery];

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
      /*if (baseQuery.subscribe) {
        await this.getActionPermission(
          'subscribe',
          baseQuery.model,
          permissionModel,
          session,
        );
      }*/

      if (baseQuery.query.select) {
        this.processSelect(queue, baseQuery, session, modelFields);
      } else {
        // Add default fields to select
        await this.addDefaultSelects(queue, baseQuery, session, modelFields);
      }

      if (baseQuery.query.orderBy) {
        await this.checkOrderBy(baseQuery, session);
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
          await this.classifyFields({
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
        await this.checkWhere(
          {
            model: baseQuery.model,
            where: baseQuery.query.where,
          },
          session,
        );
      }

      if (baseQuery.query.having) {
        await this.checkWhere(
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

    const prisma = await this.prismaService.getPrisma(session.iid);

    if (!prisma) {
      throw new WsException(
        `Institute #${session.iid} is either not found or not active`,
        'UNAUTHORIZED',
      );
    }

    const query = rootQuery.query;

    try {
      return await (prisma[rootQuery.model][rootQuery.type] as any)(query);
    } catch (e) {
      throw new WsException(
        'Something went wrong while executing query, please contact support',
        'PRISMA_ERROR',
      );
    }

    // TODO: Add support for subscriptions
  }

  public async create(
    mutation: Mutation<'create'>,
    session: Session,
    trx: PrismaClient | TransactionClient,
  ): Promise<void> {
    // Connect parent
    QueryService.connectMutationParent(mutation);

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
    trx: PrismaClient | TransactionClient,
  ): Promise<Record<string, any> | void> {
    // Find item to update
    await QueryService.findItemToMutate(mutation, trx);

    if (!mutation.oldData) {
      return;
    }

    let originalSelection: Set<string> | undefined;

    // Add the scalar fields to the selection
    if (mutation.query.select) {
      originalSelection = new Set(Object.keys(mutation.query.select));

      for (const field of mutation.model.scalarFields) {
        mutation.query.select[field] = true;
      }
    } else if (mutation.query.include) {
      // No selection specified, but include is specified

      mutation.query.select = {};

      for (const field of mutation.model.scalarFields) {
        mutation.query.select[field] = true;
      }
    }

    mutation.newData = await (trx[mutation.target] as any).update(
      mutation.query,
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newData = mutation.newData!;

    const scalarData = pick(newData, mutation.model.scalarFields);

    // Do joi validation
    if (mutation.schema) {
      try {
        await mutation.schema.validateAsync(scalarData, {
          abortEarly: true,
          allowUnknown: true,
        });
      } catch (e) {
        throw new WsException(e.message, 'VALIDATION_FAILED');
      }
    }

    // Apply validation
    await this.applyValidation(mutation, session, trx);

    const eventPayload = pick(mutation, 'oldData', 'target', 'type');
    (eventPayload as any).session = session;
    (eventPayload as any).newData = scalarData;

    this.eventEmitter.emitAsync(`${mutation.target}.update`, eventPayload);

    if (!originalSelection && mutation.query.include) {
      // Delete all fields that were not selected
      for (const field of mutation.model.scalarFields) {
        delete newData[field];
      }
    } else if (originalSelection) {
      // Remove the scalar fields we added to the selection if they were not selected
      for (const field of Object.keys(newData)) {
        if (
          mutation.model.scalarFieldsSet.has(field) ||
          !originalSelection.has(field)
        ) {
          delete newData[field];
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return mutation.newData!;
  }

  public async delete(
    mutation: Mutation<'delete'>,
    session: Session,
    trx: PrismaClient | TransactionClient,
  ): Promise<Record<string, any> | void> {
    // Find item to update
    await QueryService.findItemToMutate(mutation, trx);

    if (!mutation.oldData) {
      return;
    }

    const item = await (trx[mutation.target] as any).delete(mutation.query);

    const eventPayload = pick(mutation, 'newData', 'oldData', 'target', 'type');
    (eventPayload as any).session = session;
    this.eventEmitter.emitAsync(`${mutation.target}.delete`, eventPayload);

    return item;
  }

  public async upsert(
    mutation: Mutation<'upsert'>,
    session: Session,
    trx: PrismaClient | TransactionClient,
  ): Promise<void> {
    // Find item to update
    await QueryService.findItemToMutate(mutation, trx);

    if (!mutation.oldData) {
      QueryService.connectMutationParent(mutation);

      mutation.newData = await (trx[mutation.target] as any).create({
        data: mutation.query.create,
      });

      // Apply validation
      await this.applyValidation(mutation, session, trx);

      const eventPayload = pick(
        mutation,
        'newData',
        'oldData',
        'target',
        'type',
      );
      (eventPayload as any).session = session;
      (eventPayload as any).type = 'create';
      this.eventEmitter.emitAsync(`${mutation.target}.create`, eventPayload);

      return;
    }

    mutation.newData = await (trx[mutation.target] as any).update({
      where: mutation.query.where,
      data: mutation.query.update,
    });

    // Do joi validation
    if (mutation.schema) {
      try {
        await mutation.schema.validateAsync(mutation.newData, {
          abortEarly: true,
          allowUnknown: true,
        });
      } catch (e) {
        throw new WsException(e.message, 'VALIDATION_FAILED');
      }
    }

    // Apply validation
    await this.applyValidation(mutation, session, trx);

    const eventPayload = pick(mutation, 'newData', 'oldData', 'target', 'type');
    (eventPayload as any).session = session;
    (eventPayload as any).type = 'update';
    this.eventEmitter.emitAsync(`${mutation.target}.update`, eventPayload);
  }

  public async updateManyOrDeleteMany(
    mutation: Mutation<'updateMany' | 'deleteMany'>,
    session: Session,
    trx: PrismaClient | TransactionClient,
    wsSub?: WsSub<MutationSchema>,
  ) {
    const batchSize = 10;
    const findQuery: Record<string, any> = {
      where: mutation.query.where,
      select: {},
      orderBy: {},
      take: batchSize + 1,
    };

    for (const pKey of mutation.model.primaryKey) {
      findQuery.select[pKey] = true;
      findQuery.orderBy[pKey] = 'asc';
    }

    const pKeyWrapper = mutation.model.primaryKey.join('_');
    const cursor: Record<string, any> = {};
    let cursorInner: Record<string, any> = cursor;

    if (mutation.model.primaryKey.length > 1) {
      cursor[pKeyWrapper] = {};
      cursorInner = cursor[pKeyWrapper];
    }

    let batch = 0;

    while (true) {
      if (batch > 0) {
        findQuery.cursor = cursor;
      }

      batch++;
      const items = await (trx[mutation.target] as any).findMany(findQuery);
      const mutations: Mutation<'delete' | 'update'>[] = [];

      if (items.length === 0) {
        // No more items to delete

        if (wsSub) {
          wsSub.finish();
        }
        break;
      }

      // Create delete mutations, excluding the last item
      for (const item of items.slice(0, batchSize)) {
        const mutationQuery: Record<string, any> = {
          where: {},
        };

        // Note: Deep clone to avoid mutating the original

        // Add selection if exists
        if (mutation.query.select) {
          mutationQuery.select = cloneDeep(mutation.query.select);
        }

        // Add include if exists
        if (mutation.query.include) {
          mutationQuery.include = cloneDeep(mutation.query.include);
        }

        // Add data if exists
        if (mutation.query.data) {
          mutationQuery.data = cloneDeep(mutation.query.data);
        }

        // Build where clause
        if (mutation.model.primaryKey.length > 1) {
          // Complex primary key
          mutationQuery.where[pKeyWrapper] = {};

          for (const pKey of mutation.model.primaryKey) {
            mutationQuery.where[pKeyWrapper][pKey] = item[pKey];
          }
        } else {
          // Simple primary key
          mutationQuery.where[mutation.model.primaryKey[0]] =
            item[mutation.model.primaryKey[0]];
        }

        mutations.push({
          type: mutation.type === 'updateMany' ? 'update' : 'delete',
          model: mutation.model,
          target: mutation.target,
          permission: mutation.permission,
          oldData: null,
          newData: null,
          parents: mutation.parents,
          query: mutationQuery,
        });
      }

      const mutatedItems = await Promise.all(
        mutations.map((m) => this[m.type](m as any, session, trx)),
      );

      if (wsSub) {
        // Send deleted items to client
        if (items.length < batchSize) {
          wsSub.send(mutatedItems, true);
        } else {
          wsSub.send(mutatedItems);
        }
      }

      if (items.length < batchSize) {
        // Last batch
        break;
      }

      // Update cursor
      for (const pKey of mutation.model.primaryKey) {
        cursorInner[pKey] = items[items.length - 1][pKey];
      }
    }
  }

  public async mutate(
    mutation: MutationSchema,
    session: Session,
    wsSub?: WsSub<MutationSchema>,
  ): Promise<any> {
    let select: Record<string, any> | null = null;
    let include: Record<string, any> | null = null;

    if (mutation.query.select || mutation.query.include) {
      // Process select and include
      const selectQueue: MutationSchema[] | null = [mutation];

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
          await this.addDefaultSelects(
            selectQueue,
            baseQuery,
            session,
            modelFields,
          );
        }
      }

      // Backup root query's selections
      select = mutation.query.select;
      include = mutation.query.include;
      delete mutation.query.select;
      delete mutation.query.include;
    }

    // Acquire prisma client
    const prisma = await this.prismaService.getPrisma(session.iid);

    if (!prisma) {
      throw new WsException(
        `Institute #${session.iid} is either not found or not active`,
        'UNAUTHORIZED',
      );
    }

    // Process mutations
    const mutations = await this.processMutation(mutation, session, prisma)
      .then((mutations) => mutations)
      .catch((err: WsException) => {
        if (wsSub) {
          return wsSub.error(err, true);
        }

        throw err;
      });

    if (!mutations) {
      return;
    }

    // Add select and include to root query when mutation type is one of the following
    // - delete
    // - deleteMany
    // - updateMany
    if (
      mutation.type === 'delete' ||
      mutation.type === 'deleteMany' ||
      mutation.type === 'updateMany'
    ) {
      if (select) {
        for (const mutation of mutations.current) {
          mutation.query.select = select;
        }
      }

      if (include) {
        for (const mutation of mutations.current) {
          mutation.query.include = include;
        }
      }
    }

    if (mutation.type === 'delete') {
      const item = await this.delete(
        mutations.current[0] as Mutation<'delete'>,
        session,
        prisma,
      );

      if (!item) {
        throw new WsException(
          `Item to delete is not found`,
          'RECORD_NOT_FOUND',
        );
      }

      if (wsSub) {
        return wsSub.send(item, true);
      }

      return item;
    }

    if (mutation.type === 'deleteMany' || mutation.type === 'updateMany') {
      return await prisma.$transaction(
        async (trx) => {
          for (const mutation of mutations.all) {
            await this.updateManyOrDeleteMany(
              mutation as Mutation<'deleteMany' | 'updateMany'>,
              session,
              trx,
              wsSub,
            );
          }
        },
        {
          timeout: 30000, // 30 seconds
          maxWait: 10000, // 10 seconds
        },
      );
    }

    await prisma.$transaction(async (trx) => {
      for (const mutation of mutations.all) {
        await this[mutation.type as 'create' | 'upsert' | 'update'](
          mutation as any,
          session,
          trx,
        );
      }
    });

    if (!select && !include) {
      if (mutation.type === 'createMany') {
        if (wsSub) {
          return wsSub.send(
            mutations.current.map((m) => m.newData),
            true,
          );
        }

        return mutations.current.map((m) => m.newData);
      }

      if (wsSub) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return wsSub.send(mutations.current[0].newData!, true);
      }

      return mutations.current[0].newData;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const model = this.prismaService.models[mutation.model]!;
    const query: Record<string, any> = {
      where: {},
    };

    if (select) {
      query.select = select;
    }

    if (include) {
      query.include = include;
    }

    if (mutation.type === 'createMany') {
      if (model.primaryKey.length > 1) {
        query.where[model.primaryKey[0]] = {
          in: mutations.current.map((m) => m.newData?.[model.primaryKey[0]]),
        };
      } else {
        query.where.OR = [];

        for (const m of mutations.current) {
          query.where.OR.push(pick(m.newData, model.primaryKey));
        }
      }

      return await (prisma[mutation.model] as any).findMany(query);
    }

    query.where = pick(mutations.current[0].newData, model.primaryKey);
    return await (prisma[mutation.model] as any).findFirst(query);
  }
}
