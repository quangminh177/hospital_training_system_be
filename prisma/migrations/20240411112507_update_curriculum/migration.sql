/*
  Warnings:

  - You are about to drop the `CurriculumDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CurriculumDetail" DROP CONSTRAINT "CurriculumDetail_curriculumId_fkey";

-- DropForeignKey
ALTER TABLE "CurriculumDetail" DROP CONSTRAINT "CurriculumDetail_userId_fkey";

-- DropTable
DROP TABLE "CurriculumDetail";

-- CreateTable
CREATE TABLE "curriculum_detail" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "curriculumId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "curriculum_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "curriculum_detail" ADD CONSTRAINT "curriculum_detail_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "curriculums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_detail" ADD CONSTRAINT "curriculum_detail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
