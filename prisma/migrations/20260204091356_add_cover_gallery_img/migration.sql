/*
  Warnings:

  - A unique constraint covering the columns `[coverImageId]` on the table `Destination` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coverImageId]` on the table `Package` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "coverImageId" TEXT;

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "coverImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Destination_coverImageId_key" ON "Destination"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Package_coverImageId_key" ON "Package"("coverImageId");

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
