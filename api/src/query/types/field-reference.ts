type ALL = 'ALL.read' | 'ALL.create' | 'ALL.update';
type STUDENT = 'STUDENT.read' | 'STUDENT.create' | 'STUDENT.update';
type GUARDIAN = 'GUARDIAN.read' | 'GUARDIAN.create' | 'GUARDIAN.update';
type STAFF = 'STAFF.read' | 'STAFF.create' | 'STAFF.update';
type ADMIN = 'ADMIN.read' | 'ADMIN.create' | 'ADMIN.update';
type SUPPORTER = 'SUPPORTER.read' | 'SUPPORTER.create' | 'SUPPORTER.update';
type GENERAL = 'GENERAL.read' | 'GENERAL.create' | 'GENERAL.update';
type POWER = 'POWER.read' | 'POWER.create' | 'POWER.update';
type NON_POWER = 'NON_POWER.read' | 'NON_POWER.create' | 'NON_POWER.update';
type AUTHENTICATED =
  | 'AUTHENTICATED.read'
  | 'AUTHENTICATED.create'
  | 'AUTHENTICATED.update';
type PUBLIC = 'PUBLIC.read' | 'PUBLIC.create' | 'PUBLIC.update';

export type FieldReference =
  | ALL
  | STUDENT
  | GUARDIAN
  | STAFF
  | ADMIN
  | SUPPORTER
  | GENERAL
  | POWER
  | NON_POWER
  | AUTHENTICATED
  | PUBLIC;
