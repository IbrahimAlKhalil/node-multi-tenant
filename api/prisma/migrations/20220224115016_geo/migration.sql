CREATE TABLE "Country"
(
    id serial NOT NULL,
    CONSTRAINT "Country_pkey" PRIMARY KEY (id)
);

CREATE TABLE "State"
(
    id          serial NOT NULL,
    "countryId" int    NOT NULL,
    CONSTRAINT "State_pkey" PRIMARY KEY (id),
    CONSTRAINT "State_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Division"
(
    id        serial NOT NULL,
    "stateId" int    NOT NULL,
    CONSTRAINT "Division_pkey" PRIMARY KEY (id),
    CONSTRAINT "Division_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "District"
(
    id           serial NOT NULL,
    "divisionId" int    NOT NULL,
    CONSTRAINT "District_pkey" PRIMARY KEY (id),
    CONSTRAINT "District_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "SubDistrict"
(
    id           serial NOT NULL,
    "districtId" int    NOT NULL,
    CONSTRAINT "SubDistrict_pkey" PRIMARY KEY (id),
    CONSTRAINT "SubDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "DistrictI18n"
(
    "districtId" int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "DistrictI18n_pkey" PRIMARY KEY ("districtId", "languageId"),
    CONSTRAINT "DistrictI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DistrictI18n_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CountryI18n"
(
    "countryId"  int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "CountryI18n_pkey" PRIMARY KEY ("countryId", "languageId"),
    CONSTRAINT "CountryI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CountryI18n_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "DivisionI18n"
(
    "divisionId" int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "DivisionI18n_pkey" PRIMARY KEY ("divisionId", "languageId"),
    CONSTRAINT "DivisionI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DivisionI18n_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "StateI18n"
(
    "stateId"    int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "StateI18n_pkey" PRIMARY KEY ("stateId", "languageId"),
    CONSTRAINT "StateI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StateI18n_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "SubDistrictI18n"
(
    "subDistrictId" int          NOT NULL,
    "languageId"    int          NOT NULL,
    name            varchar(100) NOT NULL,
    CONSTRAINT "SubDistrictI18n_pkey" PRIMARY KEY ("subDistrictId", "languageId"),
    CONSTRAINT "SubDistrictI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubDistrictI18n_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "State_countryId_idx" ON "State" ("countryId");

CREATE INDEX "Division_stateId_idx" ON "Division" ("stateId");

CREATE INDEX "District_divisionId_idx" ON "District" ("divisionId");

CREATE INDEX "SubDistrict_districtId_idx" ON "SubDistrict" ("districtId");