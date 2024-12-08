/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "candidates_stripeCustomerId_key" ON "candidates"("stripeCustomerId");
