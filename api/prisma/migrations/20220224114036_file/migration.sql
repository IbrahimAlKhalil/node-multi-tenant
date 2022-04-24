CREATE TABLE "Folder"
(
    id         serial       NOT NULL,
    name       varchar(255) NOT NULL,
    "parentId" int,
    CONSTRAINT "Folder_pkey" PRIMARY KEY (id),
    CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder" (id)
);

CREATE TABLE "MimeType"
(
    id        serial       NOT NULL,
    name      varchar(255) NOT NULL,
    extension varchar(255) NOT NULL,
    CONSTRAINT "MimeType_pkey" PRIMARY KEY (id)
);

CREATE TABLE "File"
(
    id           uuid         NOT NULL,
    "folderId"   int,
    "mimeTypeId" int          NOT NULL,
    name         varchar(255) NOT NULL,
    size         bigint       NOT NULL,
    CONSTRAINT "File_pkey" PRIMARY KEY (id),
    CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder" (id),
    CONSTRAINT "File_mimeTypeId_fkey" FOREIGN KEY ("mimeTypeId") REFERENCES "MimeType" (id)
);

CREATE INDEX "File_folderId_idx" ON "File" ("folderId");

CREATE INDEX "File_mimeTypeId_idx" ON "File" ("mimeTypeId");

CREATE INDEX "Folder_parentId_idx" ON "Folder" ("parentId");

CREATE INDEX "MimeType_name_idx" ON "MimeType" ("name");