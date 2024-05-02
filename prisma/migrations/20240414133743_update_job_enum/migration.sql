-- CreateEnum
CREATE TYPE "Job" AS ENUM ('Doctor', 'Nurse', 'Intern');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "job" "Job";
