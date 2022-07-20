import { Prisma, PrismaClient } from '../../../prisma/client';
import { PermissionReference } from './permission-reference';
import { Session, UserKind } from '../../types/session';
import { PermissionReturn } from './permission-return';
import { PresetReference } from './preset-reference';
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
    prisma: PrismaClient | Prisma.TransactionClient,
    ioc: ModuleRef,
  ) => PermissionReturn<I>,
  Permission = S extends 'raw'
    ? PermissionReference | PermissionFn | I
    : PermissionFn | I,
  Preset =
    | ((
        session: SessionK,
        data: Model,
        prisma: PrismaClient,
        ioc: ModuleRef,
      ) => Model | Promise<Model> | void)
    | Model,
> {
  fields: S extends 'raw'
    ? true | Set<keyof Model> | FieldReference
    : true | Set<keyof Model>;
  preset?: S extends 'raw' ? Preset | PresetReference : Preset;
  permission?: Permission;
  validation?: Permission;
}

export type UpdatePermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
  K extends UserKind = UserKind,
> = boolean | PermissionDefinition<N, S, K>;
