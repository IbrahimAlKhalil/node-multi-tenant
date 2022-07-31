import { PermissionDefinition as UpdatePermission } from './update-permission';
import { UserKindExtra } from '../../types/session';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';

export type PermissionDefinition<
  N extends ModelNames,
  S extends ModelState = 'processed',
  K extends UserKindExtra = UserKindExtra,
> = Pick<UpdatePermission<N, S, K>, 'permission'>;

export type DeletePermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
  K extends UserKindExtra = UserKindExtra,
> = boolean | PermissionDefinition<N, S, K>;
