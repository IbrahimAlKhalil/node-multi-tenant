import { ModelNames } from '../types/model-names';
import { createMany } from './create-many.js';
import { updateMany } from './update-many.js';
import { deleteMany } from './delete-many.js';
import { deleteSchema } from './delete.js';
import { create } from './create.js';
import { update } from './update.js';
import { upsert } from './upsert.js';
import Joi from 'joi';

export type SingleMutationType = 'create' | 'update' | 'delete' | 'upsert';
export type MultiMutationType = 'createMany' | 'updateMany' | 'deleteMany';
export type MutationType = SingleMutationType | MultiMutationType;

export interface MutationSchema<T = MutationType> {
  type: T;
  query: Record<string, any>;
  model: ModelNames;
}

export const mutationSchema = Joi.object<MutationSchema>({
  type: Joi.string()
    .required()
    .valid(
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
});
