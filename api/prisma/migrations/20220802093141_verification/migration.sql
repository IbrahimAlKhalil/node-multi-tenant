/*
  Warnings:

  - You are about to drop the `Varification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "verification_type" AS ENUM ('PASSWORD_RESET', 'MOBILE', 'EMAIL');

-- DropForeignKey
ALTER TABLE "Varification" DROP CONSTRAINT "Varification_userId_fkey";

-- DropTable
DROP TABLE "Varification";

-- DropEnum
DROP TYPE "varification_type";

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "verification_type" NOT NULL,
    "payload" VARCHAR(400) NOT NULL,
    "token" INTEGER NOT NULL,
    "key" VARCHAR(32) NOT NULL,
    "sentAt" TIMESTAMPTZ(6) NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "expireAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
