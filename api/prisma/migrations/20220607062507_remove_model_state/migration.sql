/*
  Warnings:

  - The values [TRASH,RESTORE,LOCK,UNLOCK,ARCHIVE,UNARCHIVE] on the enum `activity_action` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `archiveUnarchive` on the `RoleCrudPermission` table. All the data in the column will be lost.
  - You are about to drop the column `lockUnlock` on the `RoleCrudPermission` table. All the data in the column will be lost.
  - You are about to drop the column `trashRestore` on the `RoleCrudPermission` table. All the data in the column will be lost.
  - You are about to drop the `Archive` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trash` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "activity_action_new" AS ENUM ('CREATE', 'UPDATE', 'DELETE');
ALTER TABLE "Activity" ALTER COLUMN "action" TYPE "activity_action_new" USING ("action"::text::"activity_action_new");
ALTER TYPE "activity_action" RENAME TO "activity_action_old";
ALTER TYPE "activity_action_new" RENAME TO "activity_action";
DROP TYPE "activity_action_old";
COMMIT;

-- AlterTable
ALTER TABLE "RoleCrudPermission" DROP COLUMN "archiveUnarchive",
DROP COLUMN "lockUnlock",
DROP COLUMN "trashRestore";

-- DropTable
DROP TABLE "Archive";

-- DropTable
DROP TABLE "Lock";

-- DropTable
DROP TABLE "Trash";
