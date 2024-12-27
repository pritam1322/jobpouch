/*
  Warnings:

  - You are about to drop the column `stripeSubscriptionId` on the `SubscriptionDetails` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `candidates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[squareupSubscriptionId]` on the table `SubscriptionDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[squareuCustomerId]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SubscriptionDetails_stripeSubscriptionId_key";

-- DropIndex
DROP INDEX "candidates_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "SubscriptionDetails" DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "squareupSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "squareuCustomerId" TEXT,
ADD COLUMN     "squareuSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionDetails_squareupSubscriptionId_key" ON "SubscriptionDetails"("squareupSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_squareuCustomerId_key" ON "candidates"("squareuCustomerId");
