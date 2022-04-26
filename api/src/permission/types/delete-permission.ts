import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { Session } from '../../types/session';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  M,
  N extends ModelNames,
  P = Partial<
    Parameters<PrismaClient[N]['delete']>[0] &
      Parameters<PrismaClient[N]['deleteMany']>[0]
  >,
> {
  fields: true | Set<keyof M>;
  permissions?:
    | ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>)
    | P;
}

export type DeletePermission<M, N extends ModelNames> =
  | boolean
  | PermissionDefinition<M, N>;
