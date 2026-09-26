-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('MALE', 'FEMALE', 'CHILD');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "TributeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memorials" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "dateOfPassing" TIMESTAMP(3) NOT NULL,
    "biography" TEXT NOT NULL,
    "lifeStory" TEXT,
    "mainPhotograph" TEXT NOT NULL,
    "serviceInformation" TEXT,
    "familyAcknowledgement" TEXT,
    "livestreamUrl" TEXT,
    "recordingUrl" TEXT,
    "templateType" "TemplateType" NOT NULL DEFAULT 'MALE',
    "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memorials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memorial_media" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memorial_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tributes" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "visitorName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "TributeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "memorials_slug_key" ON "memorials"("slug");

-- CreateIndex
CREATE INDEX "memorials_slug_idx" ON "memorials"("slug");

-- CreateIndex
CREATE INDEX "memorials_publicationStatus_idx" ON "memorials"("publicationStatus");

-- CreateIndex
CREATE INDEX "memorials_createdAt_idx" ON "memorials"("createdAt");

-- CreateIndex
CREATE INDEX "memorial_media_memorialId_idx" ON "memorial_media"("memorialId");

-- CreateIndex
CREATE INDEX "memorial_media_sortOrder_idx" ON "memorial_media"("sortOrder");

-- CreateIndex
CREATE INDEX "tributes_memorialId_status_idx" ON "tributes"("memorialId", "status");

-- CreateIndex
CREATE INDEX "tributes_createdAt_idx" ON "tributes"("createdAt");

-- AddForeignKey
ALTER TABLE "memorial_media" ADD CONSTRAINT "memorial_media_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "memorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tributes" ADD CONSTRAINT "tributes_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "memorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
