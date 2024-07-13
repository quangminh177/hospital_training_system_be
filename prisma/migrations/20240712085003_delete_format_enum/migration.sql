/*
  Warnings:

  - You are about to drop the column `format` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `external_resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "format";

-- AlterTable
ALTER TABLE "external_resources" DROP COLUMN "format";

-- DropEnum
DROP TYPE "Format";
