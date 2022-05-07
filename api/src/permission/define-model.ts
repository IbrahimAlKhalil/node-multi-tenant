import { PermissionReference } from './types/permission-reference';
import { MutationReference } from './types/mutation-reference';
import { FieldReference } from './types/field-reference';
import { ModelNames } from './types/model-names';
import { Actions, Model } from './types/model';

const referableFields = [
  'fields',
  'permissions',
  'presets',
  'validation',
] as const;

type Reference = PermissionReference | MutationReference | FieldReference;
type ReferableField = typeof referableFields[number];
type Kind = keyof Model<any, any>['kinds'];
type Permission = Exclude<keyof Actions<any, any>, 'subscribe'>;

export function defineModel<M, N extends ModelNames>(
  model: Model<M, N>,
): Model<M, N> {
  for (const [kind, kindValue] of Object.entries(model.kinds)) {
    if (typeof kindValue === 'boolean') {
      continue;
    }

    for (const [permission, permissionValue] of Object.entries(kindValue)) {
      if (typeof permissionValue === 'boolean') {
        continue;
      }

      for (const field of referableFields) {
        if (typeof permissionValue[field] !== 'string') {
          continue;
        }

        const split = permissionValue[field].split('.');

        resolveReference(
          model,
          split[0],
          split[1],
          kind as Kind,
          permission as Permission,
          field,
          [`${kind}.${permission}` as Reference],
        );
      }
    }
  }

  return model;
}

function resolveReference(
  model: Model<any, any>,
  referenceRole: Kind,
  referencePermission: Permission,
  refererRole: Kind,
  refererPermission: Permission,
  field: ReferableField,
  stack: Reference[] = [],
): void {
  const reference = `${referenceRole}.${referencePermission}` as Reference;

  if (stack.includes(reference)) {
    throw new Error(
      `Circular reference detected in permission definition: ${stack.join(
        ' -> ',
      )} -> ${reference}`,
    );
  }

  stack.push(reference);

  const referenceRoleValue = model.kinds[referenceRole];
  const refererRoleValue = model.kinds[refererRole] as Actions<any, any>;

  if (referenceRoleValue === undefined) {
    throw new Error(`Role "${refererRole}" is not defined`);
  }

  if (typeof referenceRoleValue === 'boolean') {
    (refererRoleValue[refererPermission] as any)[field] = referenceRoleValue;
    return;
  }

  if (referenceRoleValue[referencePermission] === undefined) {
    throw new Error(
      `Permission "${referencePermission}" is not defined for kind "${referenceRole}"`,
    );
  }

  if (typeof referenceRoleValue[referencePermission] === 'boolean') {
    (refererRoleValue[refererPermission] as any)[field] =
      referenceRoleValue[referencePermission];
    return;
  }

  const referenceValue = (referenceRoleValue[referencePermission] as any)[
    field
  ];

  if (typeof referenceValue === 'string') {
    const split = referenceValue.split('.');

    return resolveReference(
      model,
      split[0] as Kind,
      split[1] as Permission,
      referenceRole,
      referencePermission,
      field,
      stack,
    );
  }

  (refererRoleValue[refererPermission] as any)[field] = referenceValue;
}
