/*
  Warnings:

  - A unique constraint covering the columns `[name,owner_id]` on the table `AccessPoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `DescriptiveGear` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `Gear` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `GearPack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `MealItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `MealPack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `Trail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `TrailGeometry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `TrailProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id]` on the table `TrailSegmentation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `owner_id` on table `AccessPoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `Collection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `DescriptiveGear` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `Gear` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `feature_sequence` to the `GearFeature` table without a default value. This is not possible if the table is not empty.
  - Made the column `owner_id` on table `GearPack` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `specs_sequence` to the `GearSpecs` table without a default value. This is not possible if the table is not empty.
  - Made the column `owner_id` on table `MealItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `MealPack` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `Trail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `TrailGeometry` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `TrailProfile` table without a default value. This is not possible if the table is not empty.
  - Made the column `owner_id` on table `TrailProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `TrailSegmentation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `TrailSegmentation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AccessPoint" DROP CONSTRAINT "AccessPoint_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "DescriptiveGear" DROP CONSTRAINT "DescriptiveGear_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Gear" DROP CONSTRAINT "Gear_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "GearPack" DROP CONSTRAINT "GearPack_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "MealItem" DROP CONSTRAINT "MealItem_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "MealPack" DROP CONSTRAINT "MealPack_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Trail" DROP CONSTRAINT "Trail_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "TrailGeometry" DROP CONSTRAINT "TrailGeometry_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "TrailProfile" DROP CONSTRAINT "TrailProfile_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "TrailSegmentation" DROP CONSTRAINT "TrailSegmentation_owner_id_fkey";

-- AlterTable
ALTER TABLE "AccessPoint" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "DescriptiveGear" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Gear" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "GearFeature" ADD COLUMN     "feature_sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GearPack" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "GearSpecs" ADD COLUMN     "specs_sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MealItem" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "MealPack" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Trail" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrailGeometry" ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrailProfile" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrailSegmentation" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "owner_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AccessPoint_name_owner_id_key" ON "AccessPoint"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_owner_id_key" ON "Collection"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "DescriptiveGear_name_owner_id_key" ON "DescriptiveGear"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "Gear_name_owner_id_key" ON "Gear"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "GearPack_name_owner_id_key" ON "GearPack"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "MealItem_name_owner_id_key" ON "MealItem"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "MealPack_name_owner_id_key" ON "MealPack"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "Trail_name_owner_id_key" ON "Trail"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "TrailGeometry_name_owner_id_key" ON "TrailGeometry"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "TrailProfile_name_owner_id_key" ON "TrailProfile"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "TrailSegmentation_name_owner_id_key" ON "TrailSegmentation"("name", "owner_id");

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveGear" ADD CONSTRAINT "DescriptiveGear_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearPack" ADD CONSTRAINT "GearPack_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trail" ADD CONSTRAINT "Trail_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailProfile" ADD CONSTRAINT "TrailProfile_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD CONSTRAINT "AccessPoint_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGeometry" ADD CONSTRAINT "TrailGeometry_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSegmentation" ADD CONSTRAINT "TrailSegmentation_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPack" ADD CONSTRAINT "MealPack_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
