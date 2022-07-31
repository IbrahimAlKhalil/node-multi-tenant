import { UpdatePermission } from './update-permission';
import { CreatePermission } from './create-permission';
import { DeletePermission } from './delete-permission';
import { ReadPermission } from './read-permission';
import { UserKindExtra } from '../../types/session';
import { UserKind } from '../../../prisma/client';
import { ModelNames } from './model-names';
import { ModelState } from './model-state';
import { ModelTypes } from './model-types';
import { ObjectSchema } from 'joi';

export interface Actions<
  N extends ModelNames,
  S extends ModelState = 'processed',
  K extends UserKindExtra = UserKindExtra,
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
      UserKind | 'POWER' | 'NON_POWER' | 'AUTHENTICATED',
      boolean | Actions<N, S, UserKind>
    > &
      Record<'PUBLIC', boolean | Actions<N, S, 'PUBLIC'>> &
      Record<'ALL', boolean | Actions<N, S>>
  >;
}
