CREATE TYPE guardian_relation_type AS ENUM (
    'FA',
    'MO',
    'BRO',
    'SIS',
    'UN',
    'AU',
    'GRF',
    'GRM',
    'SON',
    'DAU',
    'COU'
    );

CREATE TABLE "Class"
(
    id      serial NOT NULL,
    "order" int    NOT NULL,
    CONSTRAINT "Class_pkey" PRIMARY KEY (id)
);

CREATE TABLE "ClassGroup"
(
    id        serial NOT NULL,
    "classId" int    NOT NULL,
    CONSTRAINT "ClassGroup_pkey" PRIMARY KEY (id),
    CONSTRAINT "ClassGroup_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Session"
(
    id     serial NOT NULL,
    active boolean DEFAULT (FALSE),
    CONSTRAINT "Session_pkey" PRIMARY KEY (id)
);

CREATE TABLE "GuardianRole"
(
    id serial NOT NULL,
    CONSTRAINT "GuardianRole_pkey" PRIMARY KEY (id)
);

CREATE TABLE "Admission"
(
    id          serial NOT NULL,
    "classId"   int    NOT NULL,
    "groupId"   int,
    "sessionId" int    NOT NULL,
    "userId"    int    NOT NULL,
    roll        int,
    closed      boolean DEFAULT (FALSE),
    comment     varchar(350),
    CONSTRAINT "Admission_pkey" PRIMARY KEY (id),
    CONSTRAINT "Admission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Admission_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT "Admission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ClassGroup" (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT "Admission_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE "ClassGroupI18n"
(
    "groupId"    int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "ClassGroupI18n_pkey" PRIMARY KEY ("groupId", "languageId"),
    CONSTRAINT "ClassGroupI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassGroupI18n_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ClassGroup" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ClassI18n"
(
    "classId"    int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "ClassI18n_pkey" PRIMARY KEY ("classId", "languageId"),
    CONSTRAINT "ClassI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassI18n_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "GuardianRoleI18n"
(
    "roleId"     int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "GuardianRoleI18n_pkey" PRIMARY KEY ("roleId", "languageId"),
    CONSTRAINT "GuardianRoleI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GuardianRoleI18n_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "GuardianRole" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "SessionI18n"
(
    "sessionId"  int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "SessionI18n_pkey" PRIMARY KEY ("sessionId", "languageId"),
    CONSTRAINT "SessionI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SessionI18n_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "GuardianRoleUser"
(
    "guardianUserId" int NOT NULL,
    "studentUserId"  int NOT NULL,
    "roleId"         int NOT NULL,
    CONSTRAINT "GuardianRoleUser_pkey" PRIMARY KEY ("guardianUserId", "studentUserId", "roleId"),
    CONSTRAINT "GuardianRoleUser_guardianUserId_fkey" FOREIGN KEY ("guardianUserId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GuardianRoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GuardianRoleUser_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "StudentGuardian"
(
    "guardianUserId" int NOT NULL,
    "studentUserId"  int NOT NULL,
    relation         guardian_relation_type,
    CONSTRAINT "StudentGuardian_pkey" PRIMARY KEY ("guardianUserId", "studentUserId"),
    CONSTRAINT "StudentGuardian_guardianUserId_fkey" FOREIGN KEY ("guardianUserId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentGuardian_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Admission_userId_sessionId_classId_groupId_key" ON "Admission" ("userId", "sessionId", "classId", "groupId");

CREATE UNIQUE INDEX "Admission_roll_classId_groupId_key" ON "Admission" ("roll", "classId", "groupId");

CREATE INDEX "ClassGroup_classId_idx" ON "ClassGroup" ("classId");

CREATE INDEX "StudentGuardian_studentUserId_relation_idx" ON "StudentGuardian" ("studentUserId", "relation");