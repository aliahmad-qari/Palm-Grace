-- Nullable background and default focal-point coordinates preserve all existing memorials.
ALTER TABLE "memorials"
  ADD COLUMN "heroBackgroundUrl" TEXT,
  ADD COLUMN "portraitPositionX" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN "portraitPositionY" INTEGER NOT NULL DEFAULT 50;
