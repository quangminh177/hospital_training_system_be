/*
  Warnings:

  - You are about to drop the column `date` on the `classes` table. All the data in the column will be lost.
  - Added the required column `schedule` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "date",
ADD COLUMN     "schedule" "DayInWeek" NOT NULL;
