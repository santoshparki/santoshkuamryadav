-- AlterTable
ALTER TABLE "about" ADD COLUMN     "readMoreButtonText" TEXT,
ADD COLUMN     "sectionSubtitle" TEXT,
ADD COLUMN     "sectionTitle" TEXT,
ADD COLUMN     "showLessButtonText" TEXT;

-- CreateTable
CREATE TABLE "about_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "aboutId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "about_tags" ADD CONSTRAINT "about_tags_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "about"("id") ON DELETE CASCADE ON UPDATE CASCADE;
