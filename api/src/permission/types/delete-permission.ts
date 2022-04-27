import { PermissionReference } from './permission-reference';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { Session } from '../../types/session';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  N extends ModelNames,
  P = Partial<
    Parameters<PrismaClient[N]['delete']>[0] &
      Parameters<PrismaClient[N]['deleteMany']>[0]
  >,
> {
  permissions?:
    | ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>)
    | P
    | PermissionReference;
}

export type DeletePermission<N extends ModelNames> =
  | boolean
  | PermissionDefinition<N>;
