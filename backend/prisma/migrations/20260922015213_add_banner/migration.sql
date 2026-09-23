-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('ERROR', 'WARNING', 'INFO');

-- CreateEnum
CREATE TYPE "BannerStatus" AS ENUM ('OPEN', 'CLOSING_SOON', 'CLOSED');

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT 'ANNOUNCEMENT',
    "image" TEXT,
    "shortDescription" TEXT,
    "registrationUrl" TEXT,
    "actionText" TEXT,
    "deadlineText" TEXT,
    "dateLabel" TEXT,
    "type" "BannerType" NOT NULL DEFAULT 'INFO',
    "startAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "venue" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "status" "BannerStatus" NOT NULL DEFAULT 'OPEN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "noticeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Banner_isActive_expiresAt_idx" ON "Banner"("isActive", "expiresAt");

-- CreateIndex
CREATE INDEX "Banner_noticeId_idx" ON "Banner"("noticeId");

-- CreateIndex
CREATE INDEX "Banner_createdAt_idx" ON "Banner"("createdAt");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
