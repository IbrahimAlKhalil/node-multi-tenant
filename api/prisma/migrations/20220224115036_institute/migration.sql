CREATE TABLE "Institute"
(
    id     serial       NOT NULL,
    mobile varchar(16)  NOT NULL,
    email  varchar(320) NOT NULL,
    CONSTRAINT "Institute_pkey" PRIMARY KEY (id)
);

CREATE TABLE "InstituteI18n"
(
    "instituteId" int          NOT NULL,
    "languageId"  int          NOT NULL,
    logo          uuid,
    name          varchar(200) NOT NULL,
    address       varchar(150),
    slogan        varchar(300),
    CONSTRAINT "InstituteI18n_pkey" PRIMARY KEY ("instituteId", "languageId"),
    CONSTRAINT "InstituteI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InstituteI18n_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute" (id) ON DELETE CASCADE,
    CONSTRAINT "InstituteI18n_logo_fkey" FOREIGN KEY (logo) REFERENCES "File" (id) ON DELETE SET NULL ON UPDATE CASCADE
);