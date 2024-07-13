/*
  Warnings:

  - You are about to drop the column `assignmentSubmissionStatus` on the `assignment_submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assignment_submission" DROP COLUMN "assignmentSubmissionStatus",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "externalResourceId" INTEGER;

-- DropEnum
DROP TYPE "AssignmentSubmissionStatus";

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_externalResourceId_fkey" FOREIGN KEY ("externalResourceId") REFERENCES "external_resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
