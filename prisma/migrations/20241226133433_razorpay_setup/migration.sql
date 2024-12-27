/*
  Warnings:

  - You are about to drop the column `paypalSubscriptionId` on the `SubscriptionDetails` table. All the data in the column will be lost.
  - You are about to drop the column `paypalCustomerId` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `paypalSubscriptionId` on the `candidates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpaySubscriptionId]` on the table `SubscriptionDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpayCustomerId]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SubscriptionDetails_paypalSubscriptionId_key";

-- DropIndex
DROP INDEX "candidates_paypalCustomerId_key";

-- AlterTable
ALTER TABLE "SubscriptionDetails" DROP COLUMN "paypalSubscriptionId",
ADD COLUMN     "razorpaySubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "paypalCustomerId",
DROP COLUMN "paypalSubscriptionId",
ADD COLUMN     "razorpayCustomerId" TEXT,
ADD COLUMN     "razorpaySubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionDetails_razorpaySubscriptionId_key" ON "SubscriptionDetails"("razorpaySubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_razorpayCustomerId_key" ON "candidates"("razorpayCustomerId");
