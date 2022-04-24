CREATE TYPE blood_type AS ENUM (
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE'
    );

CREATE TYPE gender AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
    );

CREATE TYPE user_kind AS ENUM (
    'STUDENT',
    'GUARDIAN',
    'STAFF',
    'ADMIN',
    'VENDOR',
    'COMMON'
    );

CREATE TYPE address_type AS ENUM (
    'PRESENT',
    'PERMANENT'
    );

CREATE TABLE "User"
(
    id            serial    NOT NULL,
    type          user_kind NOT NULL,
    mobile        varchar(16),
    email         varchar(320),
    picture       uuid,
    "dateOfBirth" date,
    nid           varchar(40),
    gender        gender    NOT NULL,
    "bloodType"   blood_type,
    username      varchar(100),
    password      text,
    disabled      boolean DEFAULT (FALSE),
    CONSTRAINT "User_pkey" PRIMARY KEY (id),
    CONSTRAINT "User_picture_fkey" FOREIGN KEY (picture) REFERENCES "File" (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Address"
(
    id              serial NOT NULL,
    "userId"        int,
    "addressType"   address_type,
    "subDistrictId" int    NOT NULL,
    CONSTRAINT "Address_pkey" PRIMARY KEY (id),
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Address_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict" (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE "UserI18n"
(
    "userId"     int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    father       varchar(100),
    mother       varchar(100),
    CONSTRAINT "UserI18n_pkey" PRIMARY KEY ("userId", "languageId"),
    CONSTRAINT "UserI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserI18n_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AddressI18n"
(
    "addressId"   int          NOT NULL,
    "languageId"  int          NOT NULL,
    "addressLine" varchar(100) NOT NULL,
    CONSTRAINT "AddressI18n_pkey" PRIMARY KEY ("languageId", "addressId"),
    CONSTRAINT "AddressI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AddressI18n_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");
CREATE UNIQUE INDEX "User_mobile_key" ON "User" ("mobile");
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

CREATE INDEX "Address_subDistrictId_idx" ON "Address" ("subDistrictId");

CREATE UNIQUE INDEX "Address_userId_addressType_key" ON "Address" ("userId", "addressType");