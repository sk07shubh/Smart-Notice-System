-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FACULTY', 'STUDENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "postedById" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "noticeId" TEXT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Notice_categoryId_idx" ON "Notice"("categoryId");

-- CreateIndex
CREATE INDEX "Notice_createdAt_idx" ON "Notice"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
