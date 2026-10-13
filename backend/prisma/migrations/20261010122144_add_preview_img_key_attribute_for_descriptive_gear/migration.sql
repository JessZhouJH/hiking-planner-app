/*
  Warnings:

  - A unique constraint covering the columns `[gear_id,gear_variant_name]` on the table `GearVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GearVariant_gear_id_gear_variant_name_key" ON "GearVariant"("gear_id", "gear_variant_name");
