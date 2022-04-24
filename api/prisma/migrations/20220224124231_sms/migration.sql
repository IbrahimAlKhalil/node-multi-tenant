CREATE TYPE sms_status AS ENUM (
    'PENDING',
    'FAILED',
    'SUCCESS'
    );

CREATE TABLE "SmsTemplate"
(
    id   serial       NOT NULL,
    name varchar(100) NOT NULL,
    CONSTRAINT "SmsTemplate_pkey" PRIMARY KEY (id)
);

CREATE TABLE "SmsTemplateI18n"
(
    "templateId" int           NOT NULL,
    "languageId" int           NOT NULL,
    text         varchar(1000) NOT NULL,
    CONSTRAINT "SmsTemplateI18n_pkey" PRIMARY KEY ("templateId", "languageId"),
    CONSTRAINT "SmsTemplateI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SmsTemplateI18n_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "SmsTemplate" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Sms"
(
    id     serial        NOT NULL,
    mobile varchar(16)   NOT NULL,
    text   varchar(1000) NOT NULL,
    status sms_status    NOT NULL DEFAULT ('PENDING'),
    CONSTRAINT "Sms_pkey" PRIMARY KEY (id)
);