CREATE TABLE "Language"
(
    id   serial       NOT NULL,
    name varchar(100) NOT NULL,
    CONSTRAINT "Language_pkey" PRIMARY KEY (id)
);

CREATE TABLE "Setting"
(
    id            serial NOT NULL,
    "languageId"  int    NOT NULL,
    "smsApiToken" varchar(300),
    "smsSenderId" varchar(100),
    CONSTRAINT "Setting_pkey" PRIMARY KEY (id),
    CONSTRAINT "Setting_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);