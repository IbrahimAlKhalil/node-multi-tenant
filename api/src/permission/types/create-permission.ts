import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { Session } from '../../types/session';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  M,
  N extends ModelNames,
  P = Partial<
    Parameters<PrismaClient[N]['create']>[0] &
      Parameters<PrismaClient[N]['createMany']>[0]
  >,
> {
  fields: true | Set<keyof M>;
  permissions?:
    | ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>)
    | P;
  presets?: (session: Session, query: P, ioc: ModuleRef) => M | Promise<M>;
  validation?: (
    session: Session,
    query: P,
    ioc: ModuleRef,
  ) => boolean | Promise<boolean>;
}

export type CreatePermission<M, N extends ModelNames> =
  | boolean
  | PermissionDefinition<M, N>;
