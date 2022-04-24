CREATE TABLE "BookGroup"
(
    id serial NOT NULL,
    CONSTRAINT "BookGroup_pkey" PRIMARY KEY (id)
);

CREATE TABLE "Book"
(
    id           serial NOT NULL,
    "classId"    int    NOT NULL,
    "groupId"    int,
    "categoryId" int,
    CONSTRAINT "Book_pkey" PRIMARY KEY (id),
    CONSTRAINT "Book_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Book_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookGroup" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "BookCategory"
(
    id serial NOT NULL,
    CONSTRAINT "BookCategory_pkey" PRIMARY KEY (id)
);

CREATE TABLE "BookCategoryI18n"
(
    "categoryId" int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "BookCategoryI18n_pkey" PRIMARY KEY ("categoryId", "languageId"),
    CONSTRAINT "BookCategoryI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookCategoryI18n_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BookCategory" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "BookGroupI18n"
(
    "groupId"    int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "BookGroupI18n_pkey" PRIMARY KEY ("groupId", "languageId"),
    CONSTRAINT "BookGroupI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookGroupI18n_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookGroup" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "BookI18n"
(
    "bookId"     int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "BookI18n_pkey" PRIMARY KEY ("languageId", "bookId"),
    CONSTRAINT "BookI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookI18n_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Book_classId_idx" ON "Book" ("classId");

CREATE INDEX "Book_groupId_idx" ON "Book" ("groupId");

CREATE INDEX "Book_categoryId_idx" ON "Book" ("categoryId");