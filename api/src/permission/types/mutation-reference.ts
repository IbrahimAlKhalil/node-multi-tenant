type ALL = 'ALL.create' | 'ALL.update';
type STUDENT = 'STUDENT.create' | 'STUDENT.update';
type GUARDIAN = 'GUARDIAN.create' | 'GUARDIAN.update';
type STAFF = 'STAFF.create' | 'STAFF.update';
type ADMIN = 'ADMIN.create' | 'ADMIN.update';
type SUPPORTER = 'SUPPORTER.create' | 'SUPPORTER.update';
type GENERAL = 'GENERAL.create' | 'GENERAL.update';
type POWER = 'POWER.create' | 'POWER.update';
type NONE_POWER = 'NONE_POWER.create' | 'NONE_POWER.update';

export type MutationReference =
  | ALL
  | STUDENT
  | GUARDIAN
  | STAFF
  | ADMIN
  | SUPPORTER
  | GENERAL
  | POWER
  | NONE_POWER;
