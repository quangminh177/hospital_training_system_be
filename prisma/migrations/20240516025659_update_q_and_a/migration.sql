/*
  Warnings:

  - You are about to drop the column `image` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "answers" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "image";
