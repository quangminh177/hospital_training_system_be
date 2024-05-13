-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "topics" ALTER COLUMN "topicNo" DROP DEFAULT;
DROP SEQUENCE "topics_topicNo_seq";
