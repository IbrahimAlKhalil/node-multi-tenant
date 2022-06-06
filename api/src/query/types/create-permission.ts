import { PermissionDefinition as UpdatePermission } from './update-permission';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';
import { PrismaClient } from '../../../prisma/client';

export type PermissionDefinition<
  N extends ModelNames,
  S extends ModelState = 'processed',
> = Omit<
  UpdatePermission<
    N,
    S,
    Partial<
      | Parameters<PrismaClient[N]['create']>[0]
      | Parameters<PrismaClient[N]['createMany']>[0]
    >
  >,
  'permission'
>;

export type CreatePermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<N, S>;
