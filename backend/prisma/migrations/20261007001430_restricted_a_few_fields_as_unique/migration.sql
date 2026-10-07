/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `GearSpecsDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GearSpecsDefinition_name_key" ON "GearSpecsDefinition"("name");
