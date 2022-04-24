CREATE TABLE "Designation"
(
    id      serial NOT NULL,
    "order" int,
    CONSTRAINT "Designation_pkey" PRIMARY KEY (id)
);

CREATE TABLE "StaffGroup"
(
    id serial NOT NULL,
    CONSTRAINT "StaffGroup_pkey" PRIMARY KEY (id)
);

CREATE TABLE "Staff"
(
    id              serial NOT NULL,
    "designationId" int    NOT NULL,
    "joiningDate"   date,
    "order"         int,
    CONSTRAINT "Staff_pkey" PRIMARY KEY (id),
    CONSTRAINT "Staff_id_fkey" FOREIGN KEY (id) REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Staff_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "DesignationI18n"
(
    "designationId" int          NOT NULL,
    "languageId"    int          NOT NULL,
    name            varchar(100) NOT NULL,
    CONSTRAINT "DesignationI18n_pkey" PRIMARY KEY ("designationId", "languageId"),
    CONSTRAINT "DesignationI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DesignationI18n_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "GroupI18n"
(
    "groupId"    int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "GroupI18n_pkey" PRIMARY KEY ("groupId", "languageId"),
    CONSTRAINT "GroupI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GroupI18n_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StaffGroup" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "StaffGroupPivot"
(
    "userId"  int NOT NULL,
    "groupId" int NOT NULL,
    CONSTRAINT "StaffGroupPivot_pkey" PRIMARY KEY ("userId", "groupId"),
    CONSTRAINT "StaffGroupPivot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StaffGroupPivot_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StaffGroup" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "StaffI18n"
(
    "staffId"    int NOT NULL,
    "languageId" int NOT NULL,
    description  varchar(300),
    CONSTRAINT "StaffI18n_pkey" PRIMARY KEY ("staffId", "languageId"),
    CONSTRAINT "StaffI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StaffI18n_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Staff_designationId_idx" ON "Staff" ("designationId");