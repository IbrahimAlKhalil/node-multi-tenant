import { PermissionReference } from './permission-reference';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { PresetReference } from './preset-reference';
import { FieldReference } from './field-reference';
import { Session } from '../../types/session';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
  P = Partial<Parameters<PrismaClient[N]['updateMany']>[0]>,
  T = Partial<Parameters<PrismaClient[N]['findMany']>[0]>,
  PermissionFn = (
    session: Session,
    query: P,
    ioc: ModuleRef,
  ) => PermissionReturn<P>,
  ValidationFn = (
    session: Session,
    query: T,
    ioc: ModuleRef,
  ) => PermissionReturn<T>,
  PresetFields = Partial<M>,
  Preset =
    | ((
        session: Session,
        query: P,
        ioc: ModuleRef,
      ) => PresetFields | Promise<PresetFields>)
    | PresetFields,
> {
  fields: S extends 'raw'
    ? true | Set<keyof M> | FieldReference
    : true | Set<keyof M>;
  permission?: S extends 'raw'
    ? PermissionReference | PermissionFn | P
    : PermissionFn | P;
  preset?: S extends 'raw' ? Preset | PresetReference : Preset;
  validation?: S extends 'raw'
    ? PermissionReference | ValidationFn | T
    : ValidationFn | T;
}

export type UpdatePermission<
  M,
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<M, N, S>;
