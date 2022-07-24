/*
  Warnings:

  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `defaultLanguage` to the `Institute` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_languageId_fkey";

-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "defaultLanguage" INTEGER NOT NULL,
ADD COLUMN     "smsApiToken" VARCHAR(300),
ADD COLUMN     "smsSenderId" VARCHAR(100);

-- DropTable
DROP TABLE "Setting";

-- AddForeignKey
ALTER TABLE "Institute" ADD CONSTRAINT "Institute_defaultLanguage_fkey" FOREIGN KEY ("defaultLanguage") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
