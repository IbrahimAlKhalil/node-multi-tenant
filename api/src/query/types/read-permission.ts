import { PermissionReference } from './permission-reference';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { FieldReference } from './field-reference';
import { Session } from '../../types/session';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
  P = Partial<Parameters<PrismaClient[N]['findMany']>[0]>,
  PermissionFn = (
    session: Session,
    query: P,
    prisma: PrismaClient,
    ioc: ModuleRef,
  ) => PermissionReturn<P>,
  Permission = S extends 'raw'
    ? PermissionReference | PermissionFn | P
    : PermissionFn,
> {
  fields: S extends 'raw'
    ? true | Set<keyof M> | FieldReference
    : true | Set<keyof M>;
  permissions?: Permission;
}

export type ReadPermission<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<M, N, S>;
