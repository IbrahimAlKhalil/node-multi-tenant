import { ModelNames } from '../types/model-names';
import { findUnique } from './find-unique.js';
import { createMany } from './create-many.js';
import { updateMany } from './update-many.js';
import { deleteMany } from './delete-many.js';
import { aggregate } from './aggregate.js';
import { deleteSchema } from './delete.js';
import { findMany } from './find-many.js';
import { groupBy } from './group-by.js';
import { create } from './create.js';
import { update } from './update.js';
import { upsert } from './upsert.js';
import { count } from './count.js';
import Joi from 'joi';

export type QueryType =
  | 'findMany'
  | 'findFirst'
  | 'findUnique'
  | 'count'
  | 'groupBy'
  | 'aggregate';

export type SingleMutationType = 'create' | 'update' | 'delete' | 'upsert';
export type MultiMutationType = 'createMany' | 'updateMany' | 'deleteMany';
export type MutationType = SingleMutationType | MultiMutationType;

export interface BaseQuery<T = QueryType | MutationType> {
  type: T;
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
