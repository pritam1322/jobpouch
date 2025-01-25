-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "followupDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "referralPersonName" TEXT,
ADD COLUMN     "salaryRange" TEXT;
