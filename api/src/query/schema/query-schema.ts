import { ModelNames } from '../types/model-names';
import { findUnique } from './find-unique.js';
import { aggregate } from './aggregate.js';
import { findMany } from './find-many.js';
import { groupBy } from './group-by.js';
import { count } from './count.js';
import Joi from 'joi';

export type QueryType =
  | 'findMany'
  | 'findFirst'
  | 'findUnique'
  | 'count'
  | 'groupBy'
  | 'aggregate';

export interface QuerySchema {
  type: QueryType;
  query: Record<string, any>;
  model: ModelNames;
}

export const querySchema = Joi.object<QuerySchema>({
  type: Joi.string()
    .required()
    .valid(
      'findMany',
      'findFirst',
      'findUnique',
      'count',
      'aggregate',
      'groupBy',
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
    ],
  }),
  model: Joi.string().required(),
});
