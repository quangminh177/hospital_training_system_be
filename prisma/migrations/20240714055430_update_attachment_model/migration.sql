/*
  Warnings:

  - You are about to drop the column `data` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `attachments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "data",
DROP COLUMN "mimeType";
