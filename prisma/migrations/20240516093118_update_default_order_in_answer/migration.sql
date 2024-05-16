/*
  Warnings:

  - A unique constraint covering the columns `[defaultOrder]` on the table `answers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "answers_defaultOrder_key" ON "answers"("defaultOrder");
