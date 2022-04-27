import { PermissionReference } from './permission-reference';
import { MutationReference } from './mutation-reference';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { Session } from '../../types/session';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  M,
  N extends ModelNames,
  P = Partial<
    Parameters<PrismaClient[N]['update']>[0] &
      Parameters<PrismaClient[N]['updateMany']>[0]
  >,
> {
  fields: true | Set<keyof M>;
  permissions?:
    | ((session: Session, query: P, ioc: ModuleRef) => PermissionReturn<P>)
    | P
    | PermissionReference;
  presets?:
    | ((session: Session, query: P, ioc: ModuleRef) => M | Promise<M>)
    | MutationReference;
  validation?:
    | ((
        session: Session,
        query: P,
        ioc: ModuleRef,
      ) => boolean | Promise<boolean>)
    | MutationReference;
}

export type UpdatePermission<M, N extends ModelNames> =
  | boolean
  | PermissionDefinition<M, N>;
