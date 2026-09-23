-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_noticeId_fkey";

-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "noticeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
