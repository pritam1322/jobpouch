/*
  Warnings:

  - Made the column `razorpaySubscriptionId` on table `SubscriptionDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SubscriptionDetails" ALTER COLUMN "razorpaySubscriptionId" SET NOT NULL;
