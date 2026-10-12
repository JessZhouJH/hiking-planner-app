/*
  Warnings:

  - The values [UNSPECIFIED] on the enum `ValueType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[gear_id,tag_id]` on the table `GearTagRelation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ValueType_new" AS ENUM ('WEIGHT', 'LENGTH', 'AREA', 'VOLUME', 'TEMPERATURE', 'DURATION', 'SPEED', 'POWER', 'ENERGY', 'LUMINOUS_FLUX', 'PRESSURE', 'R_VALUE', 'CAPACITY', 'COUNT', 'PERCENTAGE', 'RATING', 'BOOLEAN', 'TEXT', 'FIT', 'SIZE', 'MATERIAL');
ALTER TABLE "GearSpecsDefinition" ALTER COLUMN "value_type" TYPE "ValueType_new" USING ("value_type"::text::"ValueType_new");
ALTER TYPE "ValueType" RENAME TO "ValueType_old";
ALTER TYPE "ValueType_new" RENAME TO "ValueType";
DROP TYPE "public"."ValueType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "GearTagRelation_gear_id_tag_id_key" ON "GearTagRelation"("gear_id", "tag_id");
