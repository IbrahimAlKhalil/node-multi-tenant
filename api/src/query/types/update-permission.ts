import { PermissionReference } from './permission-reference';
import { PermissionReturn } from './permission-return';
import { PresetReference } from './preset-reference';
import { FieldReference } from './field-reference';
import { Session } from '../../types/session';
import { ModelTypes } from './model-types';
import { ModelState } from './model-state';
import { ModelNames } from './model-names';
import { ModuleRef } from '@nestjs/core';

export interface PermissionDefinition<
  N extends ModelNames,
  S extends ModelState = 'processed',
  P = Record<string, any>,
  I = Partial<ModelTypes[N]['whereInput']>,
  Model = ModelTypes[N]['model'],
  PermissionFn = (
    session: Session,
    query: P,
    ioc: ModuleRef,
  ) => PermissionReturn<I>,
  ValidationFn = (
    session: Session,
    query: P,
    ioc: ModuleRef,
  ) => PermissionReturn<I>,
  PresetFields = Partial<Model>,
  Preset =
    | ((
        session: Session,
        query: P,
        ioc: ModuleRef,
      ) => PresetFields | Promise<PresetFields>)
    | PresetFields,
> {
  fields: S extends 'raw'
    ? true | Set<keyof Model> | FieldReference
    : true | Set<keyof Model>;
  permission?: S extends 'raw'
    ? PermissionReference | PermissionFn | I
    : PermissionFn | I;
  preset?: S extends 'raw' ? Preset | PresetReference : Preset;
  validation?: S extends 'raw'
    ? PermissionReference | ValidationFn | I
    : ValidationFn | I;
}

export type UpdatePermission<
  N extends ModelNames,
  S extends ModelState = 'processed',
> = boolean | PermissionDefinition<N, S>;
