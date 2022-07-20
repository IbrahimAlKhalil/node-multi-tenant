import { UpdatePermission } from './update-permission';
import { CreatePermission } from './create-permission';
import { DeletePermission } from './delete-permission';
import { ReadPermission } from './read-permission';
import { user_kind } from '../../../prisma/client';
import { UserKind } from '../../types/session';
import { ModelNames } from './model-names';
import { ModelState } from './model-state';
import { ModelTypes } from './model-types';
import { ObjectSchema } from 'joi';

export interface Actions<
  N extends ModelNames,
  S extends ModelState = 'processed',
  K extends UserKind = UserKind,
> {
  read?: ReadPermission<N, S, K>;
  create?: CreatePermission<N, S, K>;
  update?: UpdatePermission<N, S, K>;
  delete?: DeletePermission<N, S, K>;
  subscribe?: boolean;
}

export interface Model<
  N extends ModelNames,
  S extends ModelState = 'processed',
> {
  schema?: ObjectSchema<ModelTypes[N]['model']>;
  accessControl?: boolean;
  access: Partial<
    Record<
      user_kind | 'POWER' | 'NON_POWER' | 'AUTHENTICATED',
      boolean | Actions<N, S, user_kind>
    > &
      Record<'PUBLIC', boolean | Actions<N, S, 'PUBLIC'>> &
      Record<'ALL', boolean | Actions<N, S>>
  >;
}
