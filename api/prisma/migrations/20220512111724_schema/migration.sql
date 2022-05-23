-- CreateEnum
CREATE TYPE "activity_action" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'TRASH', 'RESTORE', 'LOCK', 'UNLOCK', 'ARCHIVE', 'REMOVE_ARCHIVE');

-- CreateEnum
CREATE TYPE "address_type" AS ENUM ('PRESENT', 'PERMANENT');

-- CreateEnum
CREATE TYPE "blood_type" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "exam_calc_method" AS ENUM ('AVERAGE', 'POINT');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "guardian_relation_type" AS ENUM ('FA', 'MO', 'BRO', 'SIS', 'UN', 'AU', 'GRF', 'GRM', 'SON', 'DAU', 'COU');

-- CreateEnum
CREATE TYPE "notification_link_type" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "sms_status" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- CreateEnum
CREATE TYPE "user_kind" AS ENUM ('STUDENT', 'GUARDIAN', 'STAFF', 'ADMIN', 'SUPPORTER', 'GENERAL');

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "csrfToken" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" "activity_action" NOT NULL,
    "table" VARCHAR(100) NOT NULL,
    "recordId" TEXT,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(50) NOT NULL,
    "userAgent" VARCHAR(255) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "addressType" "address_type",
    "subDistrictId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddressI18n" (
    "addressId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "addressLine" VARCHAR(100) NOT NULL,

    CONSTRAINT "AddressI18n_pkey" PRIMARY KEY ("languageId","addressId")
);

-- CreateTable
CREATE TABLE "Admission" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "groupId" INTEGER,
    "sessionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "roll" INTEGER,
    "closed" BOOLEAN DEFAULT false,
    "comment" VARCHAR(350),

    CONSTRAINT "Admission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Archive" (
    "table" VARCHAR(100) NOT NULL,
    "recordId" TEXT NOT NULL,

    CONSTRAINT "Archive_pkey" PRIMARY KEY ("table","recordId")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaI18n" (
    "areaId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "AreaI18n_pkey" PRIMARY KEY ("areaId","languageId")
);

-- CreateTable
CREATE TABLE "Bench" (
    "id" INTEGER NOT NULL,
    "benchGroupId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Bench_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenchGroup" (
    "id" INTEGER NOT NULL,
    "hallId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "BenchGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "groupId" INTEGER,
    "categoryId" INTEGER,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategory" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategoryI18n" (
    "categoryId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "BookCategoryI18n_pkey" PRIMARY KEY ("categoryId","languageId")
);

-- CreateTable
CREATE TABLE "BookGroup" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "BookGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookGroupI18n" (
    "groupId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "BookGroupI18n_pkey" PRIMARY KEY ("groupId","languageId")
);

-- CreateTable
CREATE TABLE "BookI18n" (
    "bookId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "BookI18n_pkey" PRIMARY KEY ("languageId","bookId")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" SERIAL NOT NULL,
    "areaId" INTEGER,
    "order" INTEGER,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildingI18n" (
    "buildingId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "BuildingI18n_pkey" PRIMARY KEY ("buildingId","languageId")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassGroup" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "ClassGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassGroupI18n" (
    "groupId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "ClassGroupI18n_pkey" PRIMARY KEY ("groupId","languageId")
);

-- CreateTable
CREATE TABLE "ClassI18n" (
    "classId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "ClassI18n_pkey" PRIMARY KEY ("classId","languageId")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryI18n" (
    "countryId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "CountryI18n_pkey" PRIMARY KEY ("countryId","languageId")
);

-- CreateTable
CREATE TABLE "Designation" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignationI18n" (
    "designationId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "DesignationI18n_pkey" PRIMARY KEY ("designationId","languageId")
);

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "divisionId" INTEGER NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistrictI18n" (
    "districtId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "DistrictI18n_pkey" PRIMARY KEY ("districtId","languageId")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" SERIAL NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DivisionI18n" (
    "divisionId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "DivisionI18n_pkey" PRIMARY KEY ("divisionId","languageId")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "presetId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "published" BOOLEAN DEFAULT false,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamBook" (
    "id" SERIAL NOT NULL,
    "presetId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "take" REAL,

    CONSTRAINT "ExamBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamBookGrade" (
    "examBookId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "mark" REAL NOT NULL,

    CONSTRAINT "ExamBookGrade_pkey" PRIMARY KEY ("examBookId","gradeId")
);

-- CreateTable
CREATE TABLE "ExamBookGroup" (
    "presetId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "cascadeFail" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExamBookGroup_pkey" PRIMARY KEY ("presetId","bookId","groupId")
);

-- CreateTable
CREATE TABLE "ExamBookGroupGrade" (
    "bookGroupId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "mark" REAL NOT NULL,

    CONSTRAINT "ExamBookGroupGrade_pkey" PRIMARY KEY ("bookGroupId","gradeId")
);

-- CreateTable
CREATE TABLE "ExamBookMethod" (
    "examBookId" INTEGER NOT NULL,
    "methodId" INTEGER NOT NULL,
    "fullMark" REAL NOT NULL,
    "failMark" REAL,

    CONSTRAINT "ExamBookMethod_pkey" PRIMARY KEY ("examBookId","methodId")
);

-- CreateTable
CREATE TABLE "ExamClassGroup" (
    "presetId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "ExamClassGroup_pkey" PRIMARY KEY ("presetId","groupId")
);

-- CreateTable
CREATE TABLE "ExamGrade" (
    "presetId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "ExamGrade_pkey" PRIMARY KEY ("presetId","gradeId")
);

-- CreateTable
CREATE TABLE "ExamHall" (
    "id" INTEGER NOT NULL,
    "columns" SMALLINT NOT NULL,
    "benches" SMALLINT NOT NULL,
    "seatsperbench" SMALLINT NOT NULL,

    CONSTRAINT "ExamHall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamMethod" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ExamMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamMethodI18n" (
    "methodId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300),

    CONSTRAINT "ExamMethodI18n_pkey" PRIMARY KEY ("methodId","languageId")
);

-- CreateTable
CREATE TABLE "ExamPreset" (
    "id" SERIAL NOT NULL,
    "calcMethod" "exam_calc_method" NOT NULL,
    "markFormula" JSON NOT NULL DEFAULT json_build_object(),
    "gradeFormula" JSON NOT NULL DEFAULT json_build_object(),
    "customGroups" JSON NOT NULL DEFAULT json_build_array(),
    "averageCondition" JSON NOT NULL DEFAULT json_build_array(),
    "failGradeId" INTEGER NOT NULL,
    "published" BOOLEAN DEFAULT false,

    CONSTRAINT "ExamPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPresetI18n" (
    "presetId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "ExamPresetI18n_pkey" PRIMARY KEY ("presetId","languageId")
);

-- CreateTable
CREATE TABLE "ExamRawResult" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "methodId" INTEGER NOT NULL,
    "mark" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "ExamRawResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamRelate" (
    "mainPresetId" INTEGER NOT NULL,
    "relatedPresetId" INTEGER NOT NULL,

    CONSTRAINT "ExamRelate_pkey" PRIMARY KEY ("mainPresetId","relatedPresetId")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER,
    "groupId" INTEGER,
    "resultGradeId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "mark" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResultGrade" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "gradeId" INTEGER,
    "point" DECIMAL(5,2),
    "position" INTEGER,

    CONSTRAINT "ExamResultGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamRoutine" (
    "id" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "methodId" INTEGER,
    "start" TIMESTAMPTZ(6) NOT NULL,
    "end" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ExamRoutine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamRoutineSeat" (
    "examId" INTEGER NOT NULL,
    "routineId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,

    CONSTRAINT "ExamRoutineSeat_pkey" PRIMARY KEY ("examId","routineId","userId")
);

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL,
    "folderId" INTEGER,
    "mimeTypeId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "size" BIGINT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Floor" (
    "id" SERIAL NOT NULL,
    "buildingId" INTEGER,
    "order" INTEGER,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorI18n" (
    "floorId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "FloorI18n_pkey" PRIMARY KEY ("floorId","languageId")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "point" REAL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeI18n" (
    "gradeId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "comment" VARCHAR(300),

    CONSTRAINT "GradeI18n_pkey" PRIMARY KEY ("gradeId","languageId")
);

-- CreateTable
CREATE TABLE "GroupI18n" (
    "groupId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "GroupI18n_pkey" PRIMARY KEY ("groupId","languageId")
);

-- CreateTable
CREATE TABLE "GuardianRole" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "GuardianRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianRoleI18n" (
    "roleId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "GuardianRoleI18n_pkey" PRIMARY KEY ("roleId","languageId")
);

-- CreateTable
CREATE TABLE "GuardianRoleUser" (
    "guardianUserId" INTEGER NOT NULL,
    "studentUserId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "GuardianRoleUser_pkey" PRIMARY KEY ("guardianUserId","studentUserId","roleId")
);

-- CreateTable
CREATE TABLE "Institute" (
    "id" SERIAL NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "email" VARCHAR(320) NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstituteI18n" (
    "instituteId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "logo" UUID,
    "name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(150),
    "slogan" VARCHAR(300),

    CONSTRAINT "InstituteI18n_pkey" PRIMARY KEY ("instituteId","languageId")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lock" (
    "table" VARCHAR(100) NOT NULL,
    "column" VARCHAR(100) NOT NULL,
    "recordId" TEXT NOT NULL,

    CONSTRAINT "Lock_pkey" PRIMARY KEY ("table","column","recordId")
);

-- CreateTable
CREATE TABLE "MimeType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "extension" VARCHAR(255) NOT NULL,

    CONSTRAINT "MimeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "baseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "picture" UUID,
    "vars" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationBase" (
    "id" SERIAL NOT NULL,
    "picture" UUID,
    "link" VARCHAR(600),
    "linkType" "notification_link_type",

    CONSTRAINT "NotificationBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationContent" (
    "baseId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" VARCHAR(350) NOT NULL,

    CONSTRAINT "NotificationContent_pkey" PRIMARY KEY ("baseId","languageId")
);

-- CreateTable
CREATE TABLE "Preset" (
    "id" INTEGER NOT NULL,
    "table" VARCHAR(100) NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "Preset_pkey" PRIMARY KEY ("id","table")
);

-- CreateTable
CREATE TABLE "Revision" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "table" VARCHAR(100) NOT NULL,
    "recordId" TEXT NOT NULL,
    "data" JSON NOT NULL,
    "delta" JSON NOT NULL,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "floorId" INTEGER,
    "order" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomI18n" (
    "roomId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "RoomI18n_pkey" PRIMARY KEY ("roomId","languageId")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" INTEGER NOT NULL,
    "benchId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionI18n" (
    "sessionId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "SessionI18n_pkey" PRIMARY KEY ("sessionId","languageId")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "languageId" INTEGER NOT NULL,
    "smsApiToken" VARCHAR(300),
    "smsSenderId" VARCHAR(100),

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sms" (
    "id" SERIAL NOT NULL,
    "mobile" VARCHAR(16) NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "status" "sms_status" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "Sms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsTemplate" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "SmsTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsTemplateI18n" (
    "templateId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "text" VARCHAR(1000) NOT NULL,

    CONSTRAINT "SmsTemplateI18n_pkey" PRIMARY KEY ("templateId","languageId")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "designationId" INTEGER NOT NULL,
    "joiningDate" DATE,
    "order" INTEGER,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffGroup" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "StaffGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffGroupPivot" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "StaffGroupPivot_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "StaffI18n" (
    "staffId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "description" VARCHAR(300),

    CONSTRAINT "StaffI18n_pkey" PRIMARY KEY ("staffId","languageId")
);

-- CreateTable
CREATE TABLE "State" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateI18n" (
    "stateId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "StateI18n_pkey" PRIMARY KEY ("stateId","languageId")
);

-- CreateTable
CREATE TABLE "StudentGuardian" (
    "guardianUserId" INTEGER NOT NULL,
    "studentUserId" INTEGER NOT NULL,
    "relation" "guardian_relation_type",

    CONSTRAINT "StudentGuardian_pkey" PRIMARY KEY ("guardianUserId","studentUserId")
);

-- CreateTable
CREATE TABLE "SubDistrict" (
    "id" SERIAL NOT NULL,
    "districtId" INTEGER NOT NULL,

    CONSTRAINT "SubDistrict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubDistrictI18n" (
    "subDistrictId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "SubDistrictI18n_pkey" PRIMARY KEY ("subDistrictId","languageId")
);

-- CreateTable
CREATE TABLE "Trash" (
    "table" VARCHAR(100) NOT NULL,
    "recordId" TEXT NOT NULL,

    CONSTRAINT "Trash_pkey" PRIMARY KEY ("table","recordId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "type" "user_kind" NOT NULL,
    "mobile" VARCHAR(16),
    "email" VARCHAR(320),
    "picture" UUID,
    "dateOfBirth" DATE,
    "nid" VARCHAR(40),
    "gender" "gender" NOT NULL,
    "bloodType" "blood_type",
    "username" VARCHAR(100),
    "password" TEXT,
    "disabled" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserI18n" (
    "userId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "father" VARCHAR(100),
    "mother" VARCHAR(100),

    CONSTRAINT "UserI18n_pkey" PRIMARY KEY ("userId","languageId")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    "message" VARCHAR(6000) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatFile" (
    "chatId" INTEGER NOT NULL,
    "fileId" UUID NOT NULL,

    CONSTRAINT "ChatFile_pkey" PRIMARY KEY ("chatId","fileId")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(600) NOT NULL,
    "inviteOnly" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMember" (
    "conversationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "lastRead" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("conversationId","userId")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleI18n" (
    "roleId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(600) NOT NULL,

    CONSTRAINT "RoleI18n_pkey" PRIMARY KEY ("roleId","languageId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" INTEGER NOT NULL,
    "table" VARCHAR(100) NOT NULL,
    "create" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL,
    "update" BOOLEAN NOT NULL,
    "delete" BOOLEAN NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","table")
);

-- CreateTable
CREATE TABLE "RoleUser" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "RoleUser_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateIndex
CREATE INDEX "AccessToken_userId_idx" ON "AccessToken"("userId");

-- CreateIndex
CREATE INDEX "Activity_action_table_recordId_idx" ON "Activity"("action", "table", "recordId");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "Address_subDistrictId_idx" ON "Address"("subDistrictId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_addressType_key" ON "Address"("userId", "addressType");

-- CreateIndex
CREATE UNIQUE INDEX "Admission_roll_classId_groupId_key" ON "Admission"("roll", "classId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Admission_userId_sessionId_classId_groupId_key" ON "Admission"("userId", "sessionId", "classId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Area_order_key" ON "Area"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Bench_benchGroupId_order_key" ON "Bench"("benchGroupId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "BenchGroup_hallId_order_key" ON "BenchGroup"("hallId", "order");

-- CreateIndex
CREATE INDEX "Book_categoryId_idx" ON "Book"("categoryId");

-- CreateIndex
CREATE INDEX "Book_classId_idx" ON "Book"("classId");

-- CreateIndex
CREATE INDEX "Book_groupId_idx" ON "Book"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Building_areaId_order_key" ON "Building"("areaId", "order");

-- CreateIndex
CREATE INDEX "ClassGroup_classId_idx" ON "ClassGroup"("classId");

-- CreateIndex
CREATE INDEX "District_divisionId_idx" ON "District"("divisionId");

-- CreateIndex
CREATE INDEX "Division_stateId_idx" ON "Division"("stateId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamBook_presetId_bookId_key" ON "ExamBook"("presetId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamRawResult_userId_examId_bookId_methodId_key" ON "ExamRawResult"("userId", "examId", "bookId", "methodId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_bookId_resultGradeId_key" ON "ExamResult"("bookId", "resultGradeId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_groupId_resultGradeId_key" ON "ExamResult"("groupId", "resultGradeId");

-- CreateIndex
CREATE INDEX "ExamResultGrade_gradeId_idx" ON "ExamResultGrade"("gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamResultGrade_examId_userId_key" ON "ExamResultGrade"("examId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamRoutine_examId_bookId_methodId_key" ON "ExamRoutine"("examId", "bookId", "methodId");

-- CreateIndex
CREATE INDEX "ExamRoutineSeat_seatId_idx" ON "ExamRoutineSeat"("seatId");

-- CreateIndex
CREATE INDEX "File_folderId_idx" ON "File"("folderId");

-- CreateIndex
CREATE INDEX "File_mimeTypeId_idx" ON "File"("mimeTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Floor_buildingId_order_key" ON "Floor"("buildingId", "order");

-- CreateIndex
CREATE INDEX "Folder_parentId_idx" ON "Folder"("parentId");

-- CreateIndex
CREATE INDEX "MimeType_name_idx" ON "MimeType"("name");

-- CreateIndex
CREATE INDEX "Notification_baseId_idx" ON "Notification"("baseId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationContent_baseId_languageId_key" ON "NotificationContent"("baseId", "languageId");

-- CreateIndex
CREATE INDEX "Revision_activityId_idx" ON "Revision"("activityId");

-- CreateIndex
CREATE INDEX "Revision_table_recordId_idx" ON "Revision"("table", "recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_floorId_order_key" ON "Room"("floorId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_benchId_order_key" ON "Seat"("benchId", "order");

-- CreateIndex
CREATE INDEX "Staff_designationId_idx" ON "Staff"("designationId");

-- CreateIndex
CREATE INDEX "State_countryId_idx" ON "State"("countryId");

-- CreateIndex
CREATE INDEX "StudentGuardian_studentUserId_relation_idx" ON "StudentGuardian"("studentUserId", "relation");

-- CreateIndex
CREATE INDEX "SubDistrict_districtId_idx" ON "SubDistrict"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_idx" ON "ChatMessage"("conversationId");

-- CreateIndex
CREATE INDEX "ChatMessage_parentId_idx" ON "ChatMessage"("parentId");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressI18n" ADD CONSTRAINT "AddressI18n_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressI18n" ADD CONSTRAINT "AddressI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ClassGroup"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaI18n" ADD CONSTRAINT "AreaI18n_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaI18n" ADD CONSTRAINT "AreaI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bench" ADD CONSTRAINT "Bench_benchGroupId_fkey" FOREIGN KEY ("benchGroupId") REFERENCES "BenchGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchGroup" ADD CONSTRAINT "BenchGroup_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "ExamHall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategoryI18n" ADD CONSTRAINT "BookCategoryI18n_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BookCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategoryI18n" ADD CONSTRAINT "BookCategoryI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGroupI18n" ADD CONSTRAINT "BookGroupI18n_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGroupI18n" ADD CONSTRAINT "BookGroupI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookI18n" ADD CONSTRAINT "BookI18n_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookI18n" ADD CONSTRAINT "BookI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingI18n" ADD CONSTRAINT "BuildingI18n_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingI18n" ADD CONSTRAINT "BuildingI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassGroup" ADD CONSTRAINT "ClassGroup_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassGroupI18n" ADD CONSTRAINT "ClassGroupI18n_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassGroupI18n" ADD CONSTRAINT "ClassGroupI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassI18n" ADD CONSTRAINT "ClassI18n_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassI18n" ADD CONSTRAINT "ClassI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryI18n" ADD CONSTRAINT "CountryI18n_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryI18n" ADD CONSTRAINT "CountryI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignationI18n" ADD CONSTRAINT "DesignationI18n_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignationI18n" ADD CONSTRAINT "DesignationI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistrictI18n" ADD CONSTRAINT "DistrictI18n_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistrictI18n" ADD CONSTRAINT "DistrictI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionI18n" ADD CONSTRAINT "DivisionI18n_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionI18n" ADD CONSTRAINT "DivisionI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBook" ADD CONSTRAINT "ExamBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBook" ADD CONSTRAINT "ExamBook_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookGrade" ADD CONSTRAINT "ExamBookGrade_examBookId_fkey" FOREIGN KEY ("examBookId") REFERENCES "ExamBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookGrade" ADD CONSTRAINT "ExamBookGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookGroup" ADD CONSTRAINT "ExamBookGroup_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookGroup" ADD CONSTRAINT "ExamBookGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookGroup" ADD CONSTRAINT "ExamBookGroup_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookGroupGrade" ADD CONSTRAINT "ExamBookGroupGrade_bookGroupId_fkey" FOREIGN KEY ("bookGroupId") REFERENCES "BookGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookGroupGrade" ADD CONSTRAINT "ExamBookGroupGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookMethod" ADD CONSTRAINT "ExamBookMethod_examBookId_fkey" FOREIGN KEY ("examBookId") REFERENCES "ExamBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamBookMethod" ADD CONSTRAINT "ExamBookMethod_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ExamMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamClassGroup" ADD CONSTRAINT "ExamClassGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ClassGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamClassGroup" ADD CONSTRAINT "ExamClassGroup_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGrade" ADD CONSTRAINT "ExamGrade_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamGrade" ADD CONSTRAINT "ExamGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamHall" ADD CONSTRAINT "ExamHall_id_fkey" FOREIGN KEY ("id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMethodI18n" ADD CONSTRAINT "ExamMethodI18n_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ExamMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMethodI18n" ADD CONSTRAINT "ExamMethodI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPreset" ADD CONSTRAINT "ExamPreset_failGradeId_fkey" FOREIGN KEY ("failGradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPresetI18n" ADD CONSTRAINT "ExamPresetI18n_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "ExamPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPresetI18n" ADD CONSTRAINT "ExamPresetI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRawResult" ADD CONSTRAINT "ExamRawResult_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRawResult" ADD CONSTRAINT "ExamRawResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRawResult" ADD CONSTRAINT "ExamRawResult_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ExamMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRawResult" ADD CONSTRAINT "ExamRawResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_resultGradeId_fkey" FOREIGN KEY ("resultGradeId") REFERENCES "ExamResultGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResultGrade" ADD CONSTRAINT "ExamResultGrade_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResultGrade" ADD CONSTRAINT "ExamResultGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResultGrade" ADD CONSTRAINT "ExamResultGrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRoutine" ADD CONSTRAINT "ExamRoutine_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRoutine" ADD CONSTRAINT "ExamRoutine_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "ExamBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRoutine" ADD CONSTRAINT "ExamRoutine_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "ExamMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRoutineSeat" ADD CONSTRAINT "ExamRoutineSeat_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRoutineSeat" ADD CONSTRAINT "ExamRoutineSeat_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "ExamRoutine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRoutineSeat" ADD CONSTRAINT "ExamRoutineSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRoutineSeat" ADD CONSTRAINT "ExamRoutineSeat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_mimeTypeId_fkey" FOREIGN KEY ("mimeTypeId") REFERENCES "MimeType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorI18n" ADD CONSTRAINT "FloorI18n_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorI18n" ADD CONSTRAINT "FloorI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GradeI18n" ADD CONSTRAINT "GradeI18n_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeI18n" ADD CONSTRAINT "GradeI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupI18n" ADD CONSTRAINT "GroupI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupI18n" ADD CONSTRAINT "GroupI18n_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StaffGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianRoleI18n" ADD CONSTRAINT "GuardianRoleI18n_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "GuardianRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianRoleI18n" ADD CONSTRAINT "GuardianRoleI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianRoleUser" ADD CONSTRAINT "GuardianRoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "GuardianRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianRoleUser" ADD CONSTRAINT "GuardianRoleUser_guardianUserId_fkey" FOREIGN KEY ("guardianUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianRoleUser" ADD CONSTRAINT "GuardianRoleUser_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteI18n" ADD CONSTRAINT "InstituteI18n_logo_fkey" FOREIGN KEY ("logo") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteI18n" ADD CONSTRAINT "InstituteI18n_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InstituteI18n" ADD CONSTRAINT "InstituteI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_picture_fkey" FOREIGN KEY ("picture") REFERENCES "File"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "NotificationBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationBase" ADD CONSTRAINT "NotificationBase_picture_fkey" FOREIGN KEY ("picture") REFERENCES "File"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NotificationContent" ADD CONSTRAINT "NotificationContent_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationContent" ADD CONSTRAINT "NotificationContent_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "NotificationBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preset" ADD CONSTRAINT "Preset_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomI18n" ADD CONSTRAINT "RoomI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomI18n" ADD CONSTRAINT "RoomI18n_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_benchId_fkey" FOREIGN KEY ("benchId") REFERENCES "Bench"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionI18n" ADD CONSTRAINT "SessionI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionI18n" ADD CONSTRAINT "SessionI18n_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsTemplateI18n" ADD CONSTRAINT "SmsTemplateI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsTemplateI18n" ADD CONSTRAINT "SmsTemplateI18n_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "SmsTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffGroupPivot" ADD CONSTRAINT "StaffGroupPivot_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StaffGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffGroupPivot" ADD CONSTRAINT "StaffGroupPivot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffI18n" ADD CONSTRAINT "StaffI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffI18n" ADD CONSTRAINT "StaffI18n_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateI18n" ADD CONSTRAINT "StateI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateI18n" ADD CONSTRAINT "StateI18n_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGuardian" ADD CONSTRAINT "StudentGuardian_guardianUserId_fkey" FOREIGN KEY ("guardianUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGuardian" ADD CONSTRAINT "StudentGuardian_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubDistrict" ADD CONSTRAINT "SubDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubDistrictI18n" ADD CONSTRAINT "SubDistrictI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubDistrictI18n" ADD CONSTRAINT "SubDistrictI18n_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_picture_fkey" FOREIGN KEY ("picture") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserI18n" ADD CONSTRAINT "UserI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserI18n" ADD CONSTRAINT "UserI18n_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatFile" ADD CONSTRAINT "ChatFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatFile" ADD CONSTRAINT "ChatFile_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleI18n" ADD CONSTRAINT "RoleI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleI18n" ADD CONSTRAINT "RoleI18n_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleUser" ADD CONSTRAINT "RoleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleUser" ADD CONSTRAINT "RoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
