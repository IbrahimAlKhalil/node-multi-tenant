import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { Session } from '../../types/session';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  M,
  N extends ModelNames,
  P = Partial<
    Parameters<PrismaClient[N]['findMany']>[0] &
      Parameters<PrismaClient[N]['findFirst']>[0] &
      Parameters<PrismaClient[N]['findUnique']>[0]
  >,
> {
  fields: true | Set<keyof M>;
  permissions?: (
    session: Session,
    query: P,
    subscribe: boolean,
    ioc: ModuleRef,
  ) => PermissionReturn<P>;
}

export type ReadPermission<M, N extends ModelNames> =
  | boolean
  | PermissionDefinition<M, N>;
