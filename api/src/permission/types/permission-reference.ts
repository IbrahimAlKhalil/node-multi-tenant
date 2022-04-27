type ALL = 'ALL.read' | 'ALl.create' | 'ALL.update' | 'ALL.delete';
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

export type PermissionReference =
  | ALL
  | STUDENT
  | GUARDIAN
  | STAFF
  | ADMIN
  | SUPPORTER
  | GENERAL;
