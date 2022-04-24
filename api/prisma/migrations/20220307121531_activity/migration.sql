CREATE TYPE activity_action AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'TRASH',
    'RESTORE',
    'LOCK',
    'UNLOCK',
    'ARCHIVE',
    'REMOVE_ARCHIVE'
    );

CREATE TABLE "Activity"
(
    id          serial          NOT NULL,
    "userId"    int             NOT NULL,
    action      activity_action NOT NULL,
    "table"     varchar(100)    NOT NULL,
    "recordId"  text,
    timestamp   timestamptz(6)  NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    ip          varchar(50)     NOT NULL,
    "userAgent" varchar(255)    NOT NULL,
    CONSTRAINT "Activity_pkey" PRIMARY KEY (id),
    CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Lock"
(
    "table"    varchar(100) NOT NULL,
    "column"   varchar(100) NOT NULL,
    "recordId" text         NOT NULL,
    CONSTRAINT "Lock_pkey" PRIMARY KEY ("table", "column", "recordId")
);

CREATE TABLE "Revision"
(
    id           serial       NOT NULL,
    "activityId" int          NOT NULL,
    "table"      varchar(100) NOT NULL,
    "recordId"   text         NOT NULL,
    data         json         NOT NULL,
    delta        json         NOT NULL,
    CONSTRAINT "Revision_pkey" PRIMARY KEY (id),
    CONSTRAINT "Revision_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Trash"
(
    "table"    varchar(100) NOT NULL,
    "recordId" text         NOT NULL,
    CONSTRAINT "Trash_pkey" PRIMARY KEY ("table", "recordId")
);

CREATE TABLE "Archive"
(
    "table"    varchar(100) NOT NULL,
    "recordId" text         NOT NULL,
    CONSTRAINT "Archive_pkey" PRIMARY KEY ("table", "recordId")
);

CREATE INDEX "Activity_action_table_recordId_idx" ON "Activity" ("action", "table", "recordId");

CREATE INDEX "Activity_userId_idx" ON "Activity" ("userId");

CREATE INDEX "Revision_activityId_idx" ON "Revision" ("activityId");

CREATE INDEX "Revision_table_recordId_idx" ON "Revision" ("table", "recordId");