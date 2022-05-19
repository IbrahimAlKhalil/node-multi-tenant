import { PermissionDefinition as UpdatePermission } from './update-permission';
import { PrismaClient } from '../../../prisma/client';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';

export type PermissionDefinition<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> = Pick<
  UpdatePermission<
    M,
    N,
    S,
    Partial<Parameters<PrismaClient[N]['findMany']>[0]>
  >,
  'fields' | 'permission'
>;

export type ReadPermission<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<M, N, S>;
