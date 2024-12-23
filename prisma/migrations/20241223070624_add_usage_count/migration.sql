/*
  Warnings:

  - You are about to drop the column `count` on the `EmailTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailTemplate" DROP COLUMN "count";

-- CreateTable
CREATE TABLE "AICred" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AICred_pkey" PRIMARY KEY ("id")
);
