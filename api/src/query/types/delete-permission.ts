import { PermissionDefinition as UpdatePermission } from './update-permission';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';

export type PermissionDefinition<
  N extends ModelNames,
  S extends ModelState = 'processed',
> = Pick<UpdatePermission<N, S>, 'permission'>;

export type DeletePermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<N, S>;
