/*
  Warnings:

  - You are about to drop the column `gear_pack_template_id` on the `GearPackComponent` table. All the data in the column will be lost.
  - You are about to drop the `GearPackTemplate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gear_pack_id` to the `GearPackComponent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GearPackComponent" DROP CONSTRAINT "GearPackComponent_gear_pack_template_id_fkey";

-- DropForeignKey
ALTER TABLE "GearPackTemplate" DROP CONSTRAINT "GearPackTemplate_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "GearPackTemplate" DROP CONSTRAINT "GearPackTemplate_gear_pack_id_fkey";

-- DropForeignKey
ALTER TABLE "GearPackTemplate" DROP CONSTRAINT "GearPackTemplate_updated_by_id_fkey";

-- AlterTable
ALTER TABLE "GearPackComponent" DROP COLUMN "gear_pack_template_id",
ADD COLUMN     "gear_pack_id" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "GearPackTemplate";

-- AddForeignKey
ALTER TABLE "GearPackComponent" ADD CONSTRAINT "GearPackComponent_gear_pack_id_fkey" FOREIGN KEY ("gear_pack_id") REFERENCES "GearPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
