import { Prisma, PrismaClient } from '../../../prisma/client';
import { PermissionReference } from './permission-reference';
import { Session, UserKindExtra } from '../../types/session';
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
  K extends UserKindExtra = UserKindExtra,
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
  Fields = Set<keyof Model>,
> {
  fields: S extends 'raw' ? true | Fields | FieldReference : true | Fields;
  preset?: S extends 'raw' ? Preset | PresetReference : Preset;
  permission?: {
    include?: Fields;
    value: Permission;
  };
  validation?: Permission;
}

export type CreatePermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
  K extends UserKindExtra = UserKindExtra,
> = boolean | PermissionDefinition<N, S, K>;
