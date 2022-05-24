import { ModelNames } from '../types/model-names';
import { findUnique } from './find-unique.js';
import { findMany } from './find-many.js';
import Joi from 'joi';
import { count } from './count';
import { aggregate } from './aggregate';
import { groupBy } from './group-by';
import { create } from './create';
import { createMany } from './create-many';
import { update } from './update';
import { updateMany } from './update-many';
import { upsert } from './upsert';
import { deleteSchema } from './delete';
import { deleteMany } from './delete-many';

export interface BaseQuery {
  type:
    | 'findMany'
    | 'findFirst'
    | 'findUnique'
    | 'count'
    | 'aggregate'
    | 'groupBy'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany';
  query: Record<string, any>;
  model: ModelNames;
  subscribe?: boolean;
}

export const baseQuery = Joi.object<BaseQuery>({
  type: Joi.string()
    .required()
    .valid(
      'findMany',
      'findFirst',
      'findUnique',
      'count',
      'aggregate',
      'groupBy',
      'create',
      'createMany',
      'update',
      'updateMany',
      'upsert',
      'delete',
      'deleteMany',
    ),
  query: Joi.when('type', {
    switch: [
      {
        is: 'findUnique',
        then: findUnique,
      },
      {
        is: 'findFirst',
        then: findMany,
      },
      {
        is: 'findMany',
        then: findMany,
      },
      {
        is: 'count',
        then: count,
      },
      {
        is: 'aggregate',
        then: aggregate,
      },
      {
        is: 'groupBy',
        then: groupBy,
      },
      {
        is: 'create',
        then: create,
      },
      {
        is: 'createMany',
        then: createMany,
      },
      {
        is: 'update',
        then: update,
      },
      {
        is: 'updateMany',
        then: updateMany,
      },
      {
        is: 'upsert',
        then: upsert,
      },
      {
        is: 'delete',
        then: deleteSchema,
      },
      {
        is: 'deleteMany',
        then: deleteMany,
      },
    ],
  }),
  model: Joi.string().required(),
  subscribe: Joi.boolean(),
});
