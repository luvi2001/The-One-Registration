-- AlterTable
ALTER TABLE "Camper" ADD COLUMN     "availableDays" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "invitedBy" TEXT NOT NULL DEFAULT '';
