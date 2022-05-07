import { ModelNames } from '../../permission/types/model-names';
import { findUnique } from './find-unique.js';
import { findMany } from './find-many.js';
import Joi from 'joi';

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
        then: findUnique.required(),
      },
      {
        is: 'findFirst',
        then: findMany,
      },
      {
        is: 'findMany',
        then: findMany,
      },
    ],
  }),
  model: Joi.string().required(),
});
