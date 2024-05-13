/*
  Warnings:

  - Added the required column `level` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Easy', 'Medium', 'Hard');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "level" "Level" NOT NULL;
