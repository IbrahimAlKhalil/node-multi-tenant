CREATE TYPE notification_link_type AS ENUM (
    'INTERNAL',
    'EXTERNAL'
    );

CREATE TABLE "NotificationBase"
(
    id         serial NOT NULL,
    picture    uuid,
    link       varchar(600),
    "linkType" notification_link_type,
    CONSTRAINT "NotificationBase_pkey" PRIMARY KEY (id),
    CONSTRAINT "NotificationBase_picture_fkey" FOREIGN KEY (picture) REFERENCES "File" (id)
);

CREATE TABLE "Notification"
(
    id       serial  NOT NULL,
    "baseId" int     NOT NULL,
    "userId" int     NOT NULL,
    picture  uuid,
    vars     jsonb,
    read     boolean NOT NULL DEFAULT (FALSE),
    CONSTRAINT "Notification_pkey" PRIMARY KEY (id),
    CONSTRAINT "Notification_picture_fkey" FOREIGN KEY (picture) REFERENCES "File" (id),
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Notification_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "NotificationBase" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "NotificationContent"
(
    "baseId"     int          NOT NULL,
    "languageId" int          NOT NULL,
    title        varchar(150) NOT NULL,
    description  varchar(350) NOT NULL,
    CONSTRAINT "NotificationContent_pkey" PRIMARY KEY ("baseId", "languageId"),
    CONSTRAINT "NotificationContent_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NotificationContent_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "NotificationBase" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Notification_baseId_idx" ON "Notification" ("baseId");

CREATE INDEX "Notification_userId_idx" ON "Notification" ("userId");

CREATE UNIQUE INDEX "NotificationContent_baseId_languageId_key" ON "NotificationContent" ("baseId", "languageId");