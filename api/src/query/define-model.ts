import { PermissionReference } from './types/permission-reference';
import { PresetReference } from './types/preset-reference';
import { FieldReference } from './types/field-reference';
import { ModelNames } from './types/model-names';
import { Actions, Model } from './types/model';

const referableFields = [
  'fields',
  'permission',
  'preset',
  'validation',
] as const;

type Reference = PermissionReference | PresetReference | FieldReference;
type ReferableField = typeof referableFields[number];
type Kind = keyof Model<any, 'raw'>['access'];
type Permission = Exclude<keyof Actions<any, 'raw'>, 'subscribe'>;

function resolveReferencePath(field: ReferableField, split: string[]): void {
  if (
    field === 'validation' &&
    (split[1] === 'read' || split[1] === 'delete')
  ) {
    split.push('permission');
  } else if (field === 'permission' && split[1] === 'create') {
    split.push('validation');
  } else {
    split.push(field);
  }
}

export function defineModel<N extends ModelNames>(
  model: Model<N, 'raw'>,
): Model<N> {
  for (const [kind, kindValue] of Object.entries(model.access)) {
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

        if (split.length === 2) {
          resolveReferencePath(field, split);
        }

        resolveReference(
          model,
          split[0],
          split[1],
          kind as Kind,
          permission as Permission,
          split[2],
          field,
          [`${kind}.${permission}` as Reference],
        );
      }
    }
  }

  return model as Model<N>;
}

function resolveReference(
  model: Model<any, 'raw'>,
  referenceRole: Kind,
  referencePermission: Permission,
  refererRole: Kind,
  refererPermission: Permission,
  referenceField: ReferableField,
  refererField: ReferableField,
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

  const referenceRoleValue = model.access[referenceRole];
  const refererRoleValue = model.access[refererRole] as Actions<any, 'raw'>;

  if (referenceRoleValue === undefined) {
    throw new Error(`Role "${refererRole}" is not defined`);
  }

  if (typeof referenceRoleValue === 'boolean') {
    (refererRoleValue[refererPermission] as any)[refererField] =
      referenceRoleValue;
    return;
  }

  if (referenceRoleValue[referencePermission] === undefined) {
    throw new Error(
      `Permission "${referencePermission}" is not defined for kind "${referenceRole}"`,
    );
  }

  if (typeof referenceRoleValue[referencePermission] === 'boolean') {
    (refererRoleValue[refererPermission] as any)[refererField] =
      referenceRoleValue[referencePermission];
    return;
  }

  const referenceValue = (referenceRoleValue[referencePermission] as any)[
    referenceField
  ];

  if (typeof referenceValue === 'string') {
    const split = referenceValue.split('.');

    if (split.length === 2) {
      resolveReferencePath(referenceField, split);
    }

    return resolveReference(
      model,
      split[0] as Kind,
      split[1] as Permission,
      referenceRole,
      referencePermission,
      split[2] as ReferableField,
      referenceField,
      stack,
    );
  }

  (refererRoleValue[refererPermission] as any)[refererField] = referenceValue;
}
