/*
  Warnings:

  - You are about to drop the `_CertificationToCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClassToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departmentId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CertificationToCourse" DROP CONSTRAINT "_CertificationToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_CertificationToCourse" DROP CONSTRAINT "_CertificationToCourse_B_fkey";

-- DropForeignKey
ALTER TABLE "_ClassToUser" DROP CONSTRAINT "_ClassToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassToUser" DROP CONSTRAINT "_ClassToUser_B_fkey";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CertificationToCourse";

-- DropTable
DROP TABLE "_ClassToUser";

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
