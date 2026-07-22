-- CreateEnum
CREATE TYPE "Area" AS ENUM ('DEMATAGODA', 'KURULOPANA', 'VATALA', 'VALAVATA', 'KOTEJENA');

-- CreateTable
CREATE TABLE "Camper" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "area" "Area" NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Camper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Camper_area_idx" ON "Camper"("area");

-- CreateIndex
CREATE INDEX "Camper_fullName_idx" ON "Camper"("fullName");
