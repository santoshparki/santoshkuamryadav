/*
  Warnings:

  - You are about to drop the column `address` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `availabilityStatus` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `currentLocation` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `professionalTitle` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `profileImageFileName` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `profileImageUrl` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `resumeFileName` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `yearsOfExperience` on the `about` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "about" DROP COLUMN "address",
DROP COLUMN "availabilityStatus",
DROP COLUMN "currentLocation",
DROP COLUMN "dateOfBirth",
DROP COLUMN "email",
DROP COLUMN "fullName",
DROP COLUMN "languages",
DROP COLUMN "nationality",
DROP COLUMN "phone",
DROP COLUMN "professionalTitle",
DROP COLUMN "profileImageFileName",
DROP COLUMN "profileImageUrl",
DROP COLUMN "resumeFileName",
DROP COLUMN "resumeUrl",
DROP COLUMN "yearsOfExperience";
