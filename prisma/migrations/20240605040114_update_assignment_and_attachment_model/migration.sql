/*
  Warnings:

  - Added the required column `data` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_assignmentSubmissionId_fkey";

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "data" BYTEA NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ALTER COLUMN "assignmentId" DROP NOT NULL,
ALTER COLUMN "assignmentSubmissionId" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "format" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_assignmentSubmissionId_fkey" FOREIGN KEY ("assignmentSubmissionId") REFERENCES "assignment_submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
