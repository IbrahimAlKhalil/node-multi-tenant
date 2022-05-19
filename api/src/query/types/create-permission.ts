import { PermissionDefinition as UpdatePermission } from './update-permission';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';

export type PermissionDefinition<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> = Omit<UpdatePermission<M, N, S>, 'permission'>;

export type CreatePermission<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<M, N, S>;
