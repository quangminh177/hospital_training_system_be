/*
  Warnings:

  - You are about to drop the column `curriculumId` on the `courses` table. All the data in the column will be lost.
  - Added the required column `curriculumId` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_curriculumId_fkey";

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "curriculumId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "curriculumId";

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "curriculums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
