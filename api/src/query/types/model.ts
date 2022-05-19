import { UpdatePermission } from './update-permission';
import { CreatePermission } from './create-permission';
import { DeletePermission } from './delete-permission';
import { ReadPermission } from './read-permission';
import { user_kind } from '../../../prisma/client';
import { ModelNames } from './model-names';
import { ModelState } from './model-state';
import { ObjectSchema } from 'joi';

export interface Actions<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> {
  read?: ReadPermission<M, N, S>;
  create?: CreatePermission<M, N, S>;
  update?: UpdatePermission<M, N, S>;
  delete?: DeletePermission<N, S>;
  subscribe?: boolean;
}

export interface Model<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> {
  schema?: ObjectSchema<M>;
  kinds: Partial<
    Record<
      user_kind | 'ALL' | 'POWER' | 'NON_POWER',
      boolean | Actions<M, N, S>
    >
  >;
}
