/*
  Warnings:

  - You are about to drop the column `gear_description` on the `GearPackComponent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GearPackComponent" DROP COLUMN "gear_description",
ADD COLUMN     "descriptive_gear_id" INTEGER;

-- AddForeignKey
ALTER TABLE "GearPackComponent" ADD CONSTRAINT "GearPackComponent_descriptive_gear_id_fkey" FOREIGN KEY ("descriptive_gear_id") REFERENCES "DescriptiveGear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
