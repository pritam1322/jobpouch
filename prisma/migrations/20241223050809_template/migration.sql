/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `EmailTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_userId_key" ON "EmailTemplate"("userId");
