import { MutationPermission } from './mutation-permission';
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
  create?: MutationPermission<M, N, 'create', S>;
  update?: MutationPermission<M, N, 'update', S>;
  delete?: DeletePermission<N, S>;
  subscribe?: boolean;
}

export interface Model<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> {
  parent?: Model<any, N, 'raw'>;
  schema?: ObjectSchema<M>;
  kinds: Partial<
    Record<
      user_kind | 'ALL' | 'POWER' | 'NON_POWER',
      boolean | Actions<M, N, S>
    >
  >;
}
