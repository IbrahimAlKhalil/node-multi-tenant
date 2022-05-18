import { PermissionReference } from './permission-reference';
import { MutationReference } from './mutation-reference';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { FieldReference } from './field-reference';
import { Session } from '../../types/session';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

type Action = 'update' | 'create';

export interface PermissionDefinition<
  M,
  N extends ModelNames,
  A extends Action,
  S extends ModelState = 'processed',
  P = Partial<Parameters<PrismaClient[N][A]>[0]>,
  PermissionFn = (
    session: Session,
    query: P,
    prisma: PrismaClient,
    ioc: ModuleRef,
  ) => PermissionReturn<P>,
  Permission = S extends 'raw'
    ? PermissionReference | PermissionFn | P
    : PermissionFn,
  Preset = (
    session: Session,
    query: P,
    prisma: PrismaClient,
    ioc: ModuleRef,
  ) => Partial<M> | Promise<Partial<M>>,
> {
  fields: S extends 'raw'
    ? true | Set<keyof M> | FieldReference
    : true | Set<keyof M>;
  permissions?: Permission;
  presets?: S extends 'raw' ? Preset | MutationReference : Preset;
  validation?: Permission;
}

export type MutationPermission<
  M,
  N extends ModelNames,
  A extends Action,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<M, N, A, S>;
