/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AICred` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AICred_userId_key" ON "AICred"("userId");

-- AddForeignKey
ALTER TABLE "AICred" ADD CONSTRAINT "AICred_userId_fkey" FOREIGN KEY ("userId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
