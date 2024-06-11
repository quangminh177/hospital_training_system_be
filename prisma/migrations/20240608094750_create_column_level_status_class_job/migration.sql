/*
  Warnings:

  - You are about to drop the column `status` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `job` on the `users` table. All the data in the column will be lost.
  - Added the required column `levelId` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "status",
ADD COLUMN     "statusClassId" INTEGER;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "level",
ADD COLUMN     "levelId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "job",
ADD COLUMN     "jobId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Job";

-- DropEnum
DROP TYPE "Level";

-- DropEnum
DROP TYPE "StatusClass";

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "jobName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statusClasses" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "statusClass" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "statusClasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "level" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_statusClassId_fkey" FOREIGN KEY ("statusClassId") REFERENCES "statusClasses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
