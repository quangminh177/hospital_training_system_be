/*
  Warnings:

  - The `chosenAnswer` column on the `quiz_attempt_detail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "quiz_attempt" ALTER COLUMN "grade" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quiz_attempt_detail" DROP COLUMN "chosenAnswer",
ADD COLUMN     "chosenAnswer" INTEGER[];

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "originalQuizId" INTEGER;
