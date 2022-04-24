CREATE TYPE exam_calc_method AS ENUM (
    'AVERAGE',
    'POINT'
    );

CREATE TABLE "Grade"
(
    id    serial NOT NULL,
    point pg_catalog.float4,
    CONSTRAINT "Grade_pkey" PRIMARY KEY (id)
);

CREATE TABLE "ExamPreset"
(
    id                 serial           NOT NULL,
    "calcMethod"       exam_calc_method NOT NULL,
    "markFormula"      json             NOT NULL DEFAULT (json_build_object()),
    "gradeFormula"     json             NOT NULL DEFAULT (json_build_object()),
    "customGroups"     json             NOT NULL DEFAULT (json_build_array()),
    "averageCondition" json             NOT NULL DEFAULT (json_build_array()),
    "failGradeId"      int              NOT NULL,
    published          boolean                   DEFAULT (FALSE),
    CONSTRAINT "ExamPreset_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExamPreset_failGradeId_fkey" FOREIGN KEY ("failGradeId") REFERENCES "Grade" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Exam"
(
    id          serial NOT NULL,
    "presetId"  int    NOT NULL,
    "sessionId" int    NOT NULL,
    "classId"   int    NOT NULL,
    published   boolean DEFAULT (FALSE),
    CONSTRAINT "Exam_pkey" PRIMARY KEY (id),
    CONSTRAINT "Exam_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Exam_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamMethod"
(
    id serial NOT NULL,
    CONSTRAINT "ExamMethod_pkey" PRIMARY KEY (id)
);

CREATE TABLE "ExamHall"
(
    id            int      NOT NULL,
    columns       smallint NOT NULL,
    benches       smallint NOT NULL,
    seatsPerBench smallint NOT NULL,
    CONSTRAINT "ExamHall_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExamHall_id_fkey" FOREIGN KEY (id) REFERENCES "Room" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "BenchGroup"
(
    id       int NOT NULL,
    "hallId" int NOT NULL,
    "order"  int NOT NULL,
    CONSTRAINT "BenchGroup_pkey" PRIMARY KEY (id),
    CONSTRAINT "BenchGroup_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "ExamHall" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamBook"
(
    id         serial  NOT NULL,
    "presetId" int     NOT NULL,
    "bookId"   int     NOT NULL,
    optional   boolean NOT NULL DEFAULT (FALSE),
    take       pg_catalog.float4,
    CONSTRAINT "ExamBook_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExamBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamBook_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Bench"
(
    id             int NOT NULL,
    "benchGroupId" int NOT NULL,
    "order"        int NOT NULL,
    CONSTRAINT "Bench_pkey" PRIMARY KEY (id),
    CONSTRAINT "Bench_benchGroupId_fkey" FOREIGN KEY ("benchGroupId") REFERENCES "BenchGroup" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamResultGrade"
(
    id        serial NOT NULL,
    "examId"  int    NOT NULL,
    "userId"  int    NOT NULL,
    "gradeId" int,
    point     numeric(5, 2),
    position  int,
    CONSTRAINT "ExamResultGrade_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExamResultGrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamResultGrade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamResultGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Seat"
(
    id        int NOT NULL,
    "benchId" int NOT NULL,
    "order"   int NOT NULL,
    CONSTRAINT "Seat_pkey" PRIMARY KEY (id),
    CONSTRAINT "Seat_benchId_fkey" FOREIGN KEY ("benchId") REFERENCES "Bench" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamRoutine"
(
    id         int            NOT NULL,
    "examId"   int            NOT NULL,
    "bookId"   int            NOT NULL,
    "methodId" int,
    start      timestamptz(6) NOT NULL,
    "end"      timestamptz(6) NOT NULL,
    CONSTRAINT "ExamRoutine_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExamRoutine_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamRoutine_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "ExamBook" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamRoutine_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ExamMethod" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamGrade"
(
    "presetId" int NOT NULL,
    "gradeId"  int NOT NULL,
    CONSTRAINT "ExamGrade_pkey" PRIMARY KEY ("presetId", "gradeId"),
    CONSTRAINT "ExamGrade_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamBookMethod"
(
    "examBookId" int               NOT NULL,
    "methodId"   int               NOT NULL,
    "fullMark"   pg_catalog.float4 NOT NULL,
    "failMark"   pg_catalog.float4,
    CONSTRAINT "ExamBookMethod_pkey" PRIMARY KEY ("examBookId", "methodId"),
    CONSTRAINT "ExamBookMethod_examBookId_fkey" FOREIGN KEY ("examBookId") REFERENCES "ExamBook" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamBookMethod_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ExamMethod" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamRawResult"
(
    id         serial        NOT NULL,
    "userId"   int           NOT NULL,
    "examId"   int           NOT NULL,
    "bookId"   int           NOT NULL,
    "methodId" int           NOT NULL,
    mark       numeric(6, 2) NOT NULL,
    CONSTRAINT "ExamRawResult_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExamRawResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamRawResult_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamRawResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamRawResult_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ExamMethod" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamResult"
(
    id              serial        NOT NULL,
    "bookId"        int,
    "groupId"       int,
    "resultGradeId" int           NOT NULL,
    "gradeId"       int           NOT NULL,
    mark            numeric(6, 2) NOT NULL,
    CONSTRAINT "ExamResult_pkey" PRIMARY KEY (id),
    CONSTRAINT "ExamResult_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamResult_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookGroup" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamResult_resultGradeId_fkey" FOREIGN KEY ("resultGradeId") REFERENCES "ExamResultGrade" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamResult_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamPresetI18n"
(
    "presetId"   int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "ExamPresetI18n_pkey" PRIMARY KEY ("presetId", "languageId"),
    CONSTRAINT "ExamPresetI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamPresetI18n_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamClassGroup"
(
    "presetId" int NOT NULL,
    "groupId"  int NOT NULL,
    CONSTRAINT "ExamClassGroup_pkey" PRIMARY KEY ("presetId", "groupId"),
    CONSTRAINT "ExamClassGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ClassGroup" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamClassGroup_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamMethodI18n"
(
    "methodId"   int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    description  varchar(300),
    CONSTRAINT "ExamMethodI18n_pkey" PRIMARY KEY ("methodId", "languageId"),
    CONSTRAINT "ExamMethodI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamMethodI18n_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ExamMethod" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "GradeI18n"
(
    "gradeId"    int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    comment      varchar(300),
    CONSTRAINT "GradeI18n_pkey" PRIMARY KEY ("gradeId", "languageId"),
    CONSTRAINT "GradeI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GradeI18n_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExamRelate"
(
    "mainPresetId"    int NOT NULL,
    "relatedPresetId" int NOT NULL,
    CONSTRAINT "ExamRelate_pkey" PRIMARY KEY ("mainPresetId", "relatedPresetId")
);

CREATE TABLE "ExamBookGrade"
(
    "examBookId" int               NOT NULL,
    "gradeId"    int               NOT NULL,
    mark         pg_catalog.float4 NOT NULL,
    CONSTRAINT "ExamBookGrade_pkey" PRIMARY KEY ("examBookId", "gradeId")
);

CREATE TABLE "ExamBookGroup"
(
    "presetId"    int     NOT NULL,
    "bookId"      int     NOT NULL,
    "groupId"     int     NOT NULL,
    "cascadeFail" boolean NOT NULL DEFAULT (FALSE),
    CONSTRAINT "ExamBookGroup_pkey" PRIMARY KEY ("presetId", "bookId", "groupId")
);

CREATE TABLE "ExamBookGroupGrade"
(
    "bookGroupId" int               NOT NULL,
    "gradeId"     int               NOT NULL,
    mark          pg_catalog.float4 NOT NULL,
    CONSTRAINT "ExamBookGroupGrade_pkey" PRIMARY KEY ("bookGroupId", "gradeId")
);

CREATE TABLE "ExamRoutineSeat"
(
    "examId"    int NOT NULL,
    "routineId" int,
    "userId"    int NOT NULL,
    "seatId"    int NOT NULL,
    CONSTRAINT "ExamRoutineSeat_pkey" PRIMARY KEY ("examId", "routineId", "userId"),
    CONSTRAINT "ExamRoutineSeat_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamRoutineSeat_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "ExamRoutine" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamRoutineSeat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamRoutineSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ExamRoutineSeat_seatId_idx" ON "ExamRoutineSeat" ("seatId");

CREATE UNIQUE INDEX "ExamRoutine_examId_bookId_methodId_key" ON "ExamRoutine" ("examId", "bookId", "methodId");

CREATE UNIQUE INDEX "BenchGroup_hallId_order_key" ON "BenchGroup" ("hallId", "order");

CREATE UNIQUE INDEX "Bench_benchGroupId_order_key" ON "Bench" ("benchGroupId", "order");

CREATE UNIQUE INDEX "Seat_benchId_order_key" ON "Seat" ("benchId", "order");

CREATE UNIQUE INDEX "ExamBook_presetId_bookId_key" ON "ExamBook" ("presetId", "bookId");

CREATE UNIQUE INDEX "ExamRawResult_userId_examId_bookId_methodId_key" ON "ExamRawResult" ("userId", "examId", "bookId", "methodId");

CREATE UNIQUE INDEX "ExamResult_bookId_resultGradeId_key" ON "ExamResult" ("bookId", "resultGradeId");

CREATE UNIQUE INDEX "ExamResult_groupId_resultGradeId_key" ON "ExamResult" ("groupId", "resultGradeId");

CREATE UNIQUE INDEX "ExamResultGrade_examId_userId_key" ON "ExamResultGrade" ("examId", "userId");

CREATE INDEX "ExamResultGrade_gradeId_idx" ON "ExamResultGrade" ("gradeId");