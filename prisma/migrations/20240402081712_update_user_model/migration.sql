-- AlterTable
ALTER TABLE "quiz_attempt_detail" ALTER COLUMN "chosenAnswer" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;
