/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `hash` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dob` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `departmentId` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isDeleted` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hashedRt` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `job` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'UPPER', 'TRAINER', 'TRAINEE');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_departmentId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "hash" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "dob" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "departmentId" SET NOT NULL,
ALTER COLUMN "isDeleted" SET NOT NULL,
ALTER COLUMN "hashedRt" SET NOT NULL,
ALTER COLUMN "job" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
