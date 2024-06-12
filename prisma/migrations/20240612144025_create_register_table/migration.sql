-- CreateTable
CREATE TABLE "register" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "classUserId" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL,

    CONSTRAINT "register_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "register" ADD CONSTRAINT "register_classUserId_fkey" FOREIGN KEY ("classUserId") REFERENCES "class_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
