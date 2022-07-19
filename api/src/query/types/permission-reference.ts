type ALL =
  | 'ALL.read'
  | 'ALL.create'
  | 'ALL.update.permission'
  | 'ALL.update.validation'
  | 'ALL.delete';
type STUDENT =
  | 'STUDENT.read'
  | 'STUDENT.create'
  | 'STUDENT.update.permission'
  | 'STUDENT.update.validation'
  | 'STUDENT.delete';
type GUARDIAN =
  | 'GUARDIAN.read'
  | 'GUARDIAN.create'
  | 'GUARDIAN.update.permission'
  | 'GUARDIAN.update.validation'
  | 'GUARDIAN.delete';
type STAFF =
  | 'STAFF.read'
  | 'STAFF.create'
  | 'STAFF.update.permission'
  | 'STAFF.update.validation'
  | 'STAFF.delete';
type ADMIN =
  | 'ADMIN.read'
  | 'ADMIN.create'
  | 'ADMIN.update.permission'
  | 'ADMIN.update.validation'
  | 'ADMIN.delete';
type SUPPORTER =
  | 'SUPPORTER.read'
  | 'SUPPORTER.create'
  | 'SUPPORTER.update.permission'
  | 'SUPPORTER.update.validation'
  | 'SUPPORTER.delete';
type GENERAL =
  | 'GENERAL.read'
  | 'GENERAL.create'
  | 'GENERAL.update.permission'
  | 'GENERAL.update.validation'
  | 'GENERAL.delete';
type POWER =
  | 'POWER.read'
  | 'POWER.create'
  | 'POWER.update.permission'
  | 'POWER.update.validation'
  | 'POWER.delete';
type NON_POWER =
  | 'NON_POWER.read'
  | 'NON_POWER.create'
  | 'NON_POWER.update.permission'
  | 'NON_POWER.update.validation'
  | 'NON_POWER.delete';
type AUTHENTICATED =
  | 'AUTHENTICATED.read'
  | 'AUTHENTICATED.create'
  | 'AUTHENTICATED.update.permission'
  | 'AUTHENTICATED.update.validation'
  | 'AUTHENTICATED.delete';
type PUBLIC =
  | 'PUBLIC.read'
  | 'PUBLIC.create'
  | 'PUBLIC.update.permission'
  | 'PUBLIC.update.validation'
  | 'PUBLIC.delete';

export type PermissionReference =
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
