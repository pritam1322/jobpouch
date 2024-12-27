/*
  Warnings:

  - You are about to drop the column `squareupSubscriptionId` on the `SubscriptionDetails` table. All the data in the column will be lost.
  - You are about to drop the column `squareuCustomerId` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `squareuSubscriptionId` on the `candidates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paypalSubscriptionId]` on the table `SubscriptionDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paypalCustomerId]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SubscriptionDetails_squareupSubscriptionId_key";

-- DropIndex
DROP INDEX "candidates_squareuCustomerId_key";

-- AlterTable
ALTER TABLE "SubscriptionDetails" DROP COLUMN "squareupSubscriptionId",
ADD COLUMN     "paypalSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "squareuCustomerId",
DROP COLUMN "squareuSubscriptionId",
ADD COLUMN     "paypalCustomerId" TEXT,
ADD COLUMN     "paypalSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionDetails_paypalSubscriptionId_key" ON "SubscriptionDetails"("paypalSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_paypalCustomerId_key" ON "candidates"("paypalCustomerId");
