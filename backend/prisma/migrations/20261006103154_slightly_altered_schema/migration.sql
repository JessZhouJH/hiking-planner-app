/*
  Warnings:

  - You are about to drop the column `parent_gear_type_id` on the `GearType` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GearType" DROP CONSTRAINT "GearType_parent_gear_type_id_fkey";

-- AlterTable
ALTER TABLE "GearType" DROP COLUMN "parent_gear_type_id",
ADD COLUMN     "is_comparable" BOOLEAN NOT NULL DEFAULT true;
