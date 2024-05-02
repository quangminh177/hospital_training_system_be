/*
  Warnings:

  - You are about to drop the `class_detail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "class_detail" DROP CONSTRAINT "class_detail_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_detail" DROP CONSTRAINT "class_detail_userId_fkey";

-- DropTable
DROP TABLE "class_detail";

-- CreateTable
CREATE TABLE "class_user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "classId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isTrainer" BOOLEAN NOT NULL DEFAULT false,
    "finalGrade" DECIMAL(65,30),

    CONSTRAINT "class_user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "class_user" ADD CONSTRAINT "class_user_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_user" ADD CONSTRAINT "class_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
