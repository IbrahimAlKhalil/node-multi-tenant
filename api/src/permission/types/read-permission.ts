import { PermissionReference } from './permission-reference';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { FieldReference } from './field-reference';
import { Session } from '../../types/session';
import { ModelNames } from './model-names';
import { ModelState } from './model-state';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
  P = Partial<Parameters<PrismaClient[N]['findMany']>[0]>,
> {
  fields: S extends 'raw'
    ? boolean | Set<keyof M> | FieldReference
    : boolean | Set<keyof M>;
  permissions?: S extends 'raw'
    ?
        | ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>)
        | P
        | PermissionReference
    : ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>) | P;
}

export type ReadPermission<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<M, N, S>;
