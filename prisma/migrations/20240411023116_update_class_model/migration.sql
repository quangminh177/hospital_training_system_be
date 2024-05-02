/*
  Warnings:

  - Changed the type of `date` on the `classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayInWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "date",
ADD COLUMN     "date" "DayInWeek" NOT NULL;
