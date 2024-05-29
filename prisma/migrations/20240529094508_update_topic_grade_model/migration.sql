/*
  Warnings:

  - Changed the type of `timeLimit` on the `quizzes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "timeLimit",
ADD COLUMN     "timeLimit" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "topic_grade" ADD COLUMN     "assignmentGrade" DECIMAL(65,30),
ADD COLUMN     "quizGrade" DECIMAL(65,30);
