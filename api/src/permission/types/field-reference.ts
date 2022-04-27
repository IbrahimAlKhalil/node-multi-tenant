type ALL = 'ALL.read' | 'ALL.create' | 'ALL.update';
type STUDENT = 'STUDENT.read' | 'STUDENT.create' | 'STUDENT.update';
type GUARDIAN = 'GUARDIAN.read' | 'GUARDIAN.create' | 'GUARDIAN.update';
type STAFF = 'STAFF.read' | 'STAFF.create' | 'STAFF.update';
type ADMIN = 'ADMIN.read' | 'ADMIN.create' | 'ADMIN.update';
type SUPPORTER = 'SUPPORTER.read' | 'SUPPORTER.create' | 'SUPPORTER.update';
type GENERAL = 'GENERAL.read' | 'GENERAL.create' | 'GENERAL.update';

export type FieldReference =
  | ALL
  | STUDENT
  | GUARDIAN
  | STAFF
  | ADMIN
  | SUPPORTER
  | GENERAL;
