CREATE TABLE "Role"
(
    id serial NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY (id)
);

CREATE TABLE "RoleI18n"
(
    "roleId"     int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    description  varchar(600) NOT NULL,
    CONSTRAINT "RoleI18n_pkey" PRIMARY KEY ("roleId", "languageId"),
    CONSTRAINT "RoleI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoleI18n_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RolePermission"
(
    "roleId" int          NOT NULL,
    "table"  varchar(100) NOT NULL,
    "create" boolean      NOT NULL,
    read     boolean      NOT NULL,
    update   boolean      NOT NULL,
    delete   boolean      NOT NULL,
    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "table"),
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RoleUser"
(
    "userId" int NOT NULL,
    "roleId" int NOT NULL,
    CONSTRAINT "RoleUser_pkey" PRIMARY KEY ("userId", "roleId"),
    CONSTRAINT "RoleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "UserPermission"
(
    "userId" int          NOT NULL,
    "table"  varchar(100) NOT NULL,
    "create" boolean      NOT NULL,
    read     boolean      NOT NULL,
    update   boolean      NOT NULL,
    delete   boolean      NOT NULL,
    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("userId", "table"),
    CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);