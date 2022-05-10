import { PermissionReference } from './permission-reference';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { Session } from '../../types/session';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  N extends ModelNames,
  S extends ModelState = 'processed',
  P = Partial<
    Parameters<PrismaClient[N]['delete']>[0] &
      Parameters<PrismaClient[N]['deleteMany']>[0]
  >,
> {
  permissions?: S extends 'raw'
    ?
        | ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>)
        | P
        | PermissionReference
    : ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>) | P;
}

export type DeletePermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<N, S>;
