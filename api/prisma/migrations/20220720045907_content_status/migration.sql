/*
  Warnings:

  - The values [TRASH,RESTORE,LOCK,UNLOCK,ARCHIVE,UNARCHIVE] on the enum `activity_action` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `published` on the `ExamPreset` table. All the data in the column will be lost.
  - You are about to drop the column `archiveUnarchive` on the `RoleCrudPermission` table. All the data in the column will be lost.
  - You are about to drop the column `lockUnlock` on the `RoleCrudPermission` table. All the data in the column will be lost.
  - You are about to drop the column `trashRestore` on the `RoleCrudPermission` table. All the data in the column will be lost.
  - You are about to drop the `Archive` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trash` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Admission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Bench` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `BookCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `BookGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ClassGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Designation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Division` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ExamHall` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ExamMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ExamPreset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ExamRoutine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Floor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `NotificationBase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SmsTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `StaffGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `State` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SubDistrict` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('LOCKED', 'ARCHIVED', 'TRASHED');

-- AlterEnum
BEGIN;
CREATE TYPE "activity_action_new" AS ENUM ('CREATE', 'UPDATE', 'DELETE');
ALTER TABLE "Activity" ALTER COLUMN "action" TYPE "activity_action_new" USING ("action"::text::"activity_action_new");
ALTER TYPE "activity_action" RENAME TO "activity_action_old";
ALTER TYPE "activity_action_new" RENAME TO "activity_action";
DROP TYPE "activity_action_old";
COMMIT;

-- AlterTable
ALTER TABLE "Admission" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Bench" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "BookCategory" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "BookGroup" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "ClassGroup" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Designation" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "District" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Division" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "ExamHall" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "ExamMethod" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "ExamPreset" DROP COLUMN "published",
ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "ExamRoutine" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Floor" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "NotificationBase" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "RoleCrudPermission" DROP COLUMN "archiveUnarchive",
DROP COLUMN "lockUnlock",
DROP COLUMN "trashRestore";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "SmsTemplate" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "StaffGroup" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "State" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "SubDistrict" ADD COLUMN     "status" "content_status" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "content_status" NOT NULL;

-- DropTable
DROP TABLE "Archive";

-- DropTable
DROP TABLE "Lock";

-- DropTable
DROP TABLE "Trash";
