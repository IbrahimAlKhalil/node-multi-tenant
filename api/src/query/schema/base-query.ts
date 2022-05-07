import { findUnique } from './find-unique.js';
import { findMany } from './find-many.js';
import Joi from 'joi';

interface BaseQuery {
  type:
    | 'findMany'
    | 'findFirst'
    | 'findUnique'
    | 'create'
    | 'update'
    | 'upsert'
    | 'delete'
    | 'count'
    | 'aggregate'
    | 'groupBy'
    | 'createMany'
    | 'updateMany'
    | 'deleteMany';
  query: Record<string, any>;
}

export const baseQuery = Joi.object<BaseQuery>({
  type: Joi.string()
    .required()
    .valid(
      'findMany',
      'findFirst',
      'findUnique',
      'create',
      'update',
      'upsert',
      'delete',
      'count',
      'aggregate',
      'groupBy',
      'createMany',
      'updateMany',
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
});
