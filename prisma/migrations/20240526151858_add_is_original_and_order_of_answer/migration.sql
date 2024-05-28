/*
  Warnings:

  - Added the required column `orderOfAnswer` to the `quiz_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quiz_detail" ADD COLUMN     "orderOfAnswer" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "isOriginal" BOOLEAN NOT NULL DEFAULT true;
