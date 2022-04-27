type ALL = 'ALL.read' | 'ALL.create' | 'ALL.update' | 'ALL.delete';
type STUDENT =
  | 'STUDENT.read'
  | 'STUDENT.create'
  | 'STUDENT.update'
  | 'STUDENT.delete';
type GUARDIAN =
  | 'GUARDIAN.read'
  | 'GUARDIAN.create'
  | 'GUARDIAN.update'
  | 'GUARDIAN.delete';
type STAFF = 'STAFF.read' | 'STAFF.create' | 'STAFF.update' | 'STAFF.delete';
type ADMIN = 'ADMIN.read' | 'ADMIN.create' | 'ADMIN.update' | 'ADMIN.delete';
type SUPPORTER =
  | 'SUPPORTER.read'
  | 'SUPPORTER.create'
  | 'SUPPORTER.update'
  | 'SUPPORTER.delete';
type GENERAL =
  | 'GENERAL.read'
  | 'GENERAL.create'
  | 'GENERAL.update'
  | 'GENERAL.delete';
type POWER = 'POWER.read' | 'POWER.create' | 'POWER.update' | 'POWER.delete';
type NON_POWER =
  | 'NON_POWER.read'
  | 'NON_POWER.create'
  | 'NON_POWER.update'
  | 'NON_POWER.delete';

export type PermissionReference =
  | ALL
  | STUDENT
  | GUARDIAN
  | STAFF
  | ADMIN
  | SUPPORTER
  | GENERAL
  | POWER
  | NON_POWER;
