/*
  Warnings:

  - Made the column `paypalSubscriptionId` on table `SubscriptionDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SubscriptionDetails" ALTER COLUMN "paypalSubscriptionId" SET NOT NULL;
