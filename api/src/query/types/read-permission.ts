import { PermissionReference } from './permission-reference';
import { Session, UserKind } from '../../types/session';
import { PermissionReturn } from './permission-return';
import { PrismaClient } from '../../../prisma/client';
import { FieldReference } from './field-reference';
import { ModelTypes } from './model-types';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  N extends ModelNames,
  S extends ModelState = 'processed',
  K extends UserKind = UserKind,
  I = Partial<ModelTypes[N]['whereInput']>,
  Model = Partial<ModelTypes[N]['model']>,
  SessionK = Session<K>,
  PermissionFn = (
    session: SessionK,
    prisma: PrismaClient,
    ioc: ModuleRef,
  ) => PermissionReturn<I>,
  Permission = S extends 'raw'
    ? PermissionReference | PermissionFn | I
    : PermissionFn | I,
> {
  fields: S extends 'raw'
    ? true | Set<keyof Model> | FieldReference
    : true | Set<keyof Model>;
  permission?: Permission;
}

export type ReadPermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
  K extends UserKind = UserKind,
> = boolean | PermissionDefinition<N, S, K>;
