-- Add publication states without changing any existing memorial state.
ALTER TYPE "PublicationStatus" ADD VALUE 'PRIVATE_PREVIEW';
ALTER TYPE "PublicationStatus" ADD VALUE 'ARCHIVED';

-- Add media type; existing rows become photos through the column default.
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO');
ALTER TABLE "memorial_media"
  ADD COLUMN "mediaType" "MediaType" NOT NULL DEFAULT 'PHOTO';

-- Add the client-facing date model while retaining legacy columns for API compatibility.
ALTER TABLE "memorials"
  ALTER COLUMN "dateOfBirth" DROP NOT NULL,
  ALTER COLUMN "dateOfPassing" DROP NOT NULL,
  ADD COLUMN "preferredDisplayName" TEXT,
  ADD COLUMN "birthDate" TIMESTAMP(3),
  ADD COLUMN "showBirthDate" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "deathDate" TIMESTAMP(3),
  ADD COLUMN "showDeathDate" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "memorialLine" TEXT,
  ADD COLUMN "serviceTitle" TEXT,
  ADD COLUMN "serviceDate" TIMESTAMP(3),
  ADD COLUMN "serviceTime" TEXT,
  ADD COLUMN "serviceVenue" TEXT,
  ADD COLUMN "serviceAddress" TEXT,
  ADD COLUMN "viewingWakeInformation" TEXT,
  ADD COLUMN "closingWords" TEXT;

UPDATE "memorials"
SET "birthDate" = "dateOfBirth",
    "deathDate" = "dateOfPassing";

-- Keep the current tribute names/statuses; store additional contact metadata privately.
ALTER TABLE "tributes"
  ADD COLUMN "relationship" TEXT,
  ADD COLUMN "contributorEmail" TEXT;