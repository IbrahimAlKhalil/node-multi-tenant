import { UpdatePermission } from './update-permission';
import { CreatePermission } from './create-permission';
import { DeletePermission } from './delete-permission';
import { ReadPermission } from './read-permission';
import { user_kind } from '../../../prisma/client';
import { ModelNames } from './model-names';
import { ModelState } from './model-state';
import { ObjectSchema } from 'joi';
import { ModelTypes } from './prisma-types';

export interface Actions<
  N extends ModelNames,
  S extends ModelState = 'processed',
> {
  read?: ReadPermission<N, S>;
  create?: CreatePermission<N, S>;
  update?: UpdatePermission<N, S>;
  delete?: DeletePermission<N, S>;
  subscribe?: boolean;
}

export interface Model<
  N extends ModelNames,
  S extends ModelState = 'processed',
> {
  schema?: ObjectSchema<ModelTypes[N]['model']>;
  kinds: Partial<
    Record<user_kind | 'ALL' | 'POWER' | 'NON_POWER', boolean | Actions<N, S>>
  >;
}
