import { PermissionReference } from './permission-reference';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { FieldReference } from './field-reference';
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
  fields: true | Set<keyof M> | FieldReference;
  permissions?:
    | ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>)
    | P
    | PermissionReference;
}

export type ReadPermission<M, N extends ModelNames> =
  | boolean
  | PermissionDefinition<M, N>;
