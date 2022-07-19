import { PermissionDefinition as UpdatePermission } from './update-permission';
import { UserKind } from '../../types/session';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';

export type PermissionDefinition<
  N extends ModelNames,
  S extends ModelState = 'processed',
  SS extends UserKind = UserKind,
> = Pick<UpdatePermission<N, S, SS>, 'permission'>;

export type DeletePermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
  SS extends UserKind = UserKind,
> = boolean | PermissionDefinition<N, S, SS>;
