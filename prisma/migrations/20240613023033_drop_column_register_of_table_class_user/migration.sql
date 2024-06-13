/*
  Warnings:

  - You are about to drop the column `isRegistered` on the `class_user` table. All the data in the column will be lost.
  - You are about to drop the column `registerAt` on the `class_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "class_user" DROP COLUMN "isRegistered",
DROP COLUMN "registerAt";
