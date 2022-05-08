import { PermissionReference } from './permission-reference';
import { MutationReference } from './mutation-reference';
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
  P = Partial<
    Parameters<PrismaClient[N]['create']>[0] &
      Parameters<PrismaClient[N]['createMany']>[0]
  >,
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
  presets?: S extends 'raw'
    ?
        | ((
            session: Session,
            query: P,
            ioc: ModuleRef,
          ) => Partial<M> | Promise<Partial<M>>)
        | MutationReference
    : (
        session: Session,
        query: P,
        ioc: ModuleRef,
      ) => Partial<M> | Promise<Partial<M>>;
  validation?: S extends 'raw'
    ?
        | ((
            session: Session,
            query: P,
            ioc: ModuleRef,
          ) => boolean | Promise<boolean>)
        | MutationReference
    : (
        session: Session,
        query: P,
        ioc: ModuleRef,
      ) => boolean | Promise<boolean>;
}

export type CreatePermission<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<M, N, S>;
