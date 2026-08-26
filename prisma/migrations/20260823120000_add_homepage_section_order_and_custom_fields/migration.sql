-- AlterTable
ALTER TABLE "homepage_sections"
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "title" TEXT,
ADD COLUMN "description" TEXT;

-- Give existing sections a stable initial order.
UPDATE "homepage_sections"
SET "sortOrder" = CASE "key"
  WHEN 'about' THEN 10
  WHEN 'skills' THEN 20
  WHEN 'projects' THEN 30
  WHEN 'experience' THEN 40
  WHEN 'education' THEN 50
  WHEN 'certificates' THEN 60
  WHEN 'services' THEN 70
  WHEN 'contact' THEN 80
  ELSE 90
END;
