/*
  Warnings:

  - Made the column `departmentId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_departmentId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "departmentId" SET NOT NULL,
ALTER COLUMN "hashedRt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
