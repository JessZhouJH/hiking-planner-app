-- AlterTable
ALTER TABLE "Trail" ADD COLUMN     "preview_img_media_id" INTEGER;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_media_archive_id_fkey" FOREIGN KEY ("media_archive_id") REFERENCES "MediaArchive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearSpecsDefinition" ADD CONSTRAINT "GearSpecsDefinition_gear_type_id_fkey" FOREIGN KEY ("gear_type_id") REFERENCES "GearType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearSpecsDefinition" ADD CONSTRAINT "GearSpecsDefinition_default_unit_id_fkey" FOREIGN KEY ("default_unit_id") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_gear_type_id_fkey" FOREIGN KEY ("gear_type_id") REFERENCES "GearType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearSpecs" ADD CONSTRAINT "GearSpecs_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearSpecs" ADD CONSTRAINT "GearSpecs_gear_variant_id_fkey" FOREIGN KEY ("gear_variant_id") REFERENCES "GearVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearSpecs" ADD CONSTRAINT "GearSpecs_gear_specs_definition_id_fkey" FOREIGN KEY ("gear_specs_definition_id") REFERENCES "GearSpecsDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearSpecs" ADD CONSTRAINT "GearSpecs_source_unit_id_fkey" FOREIGN KEY ("source_unit_id") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearFeature" ADD CONSTRAINT "GearFeature_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearFeature" ADD CONSTRAINT "GearFeature_gear_variant_id_fkey" FOREIGN KEY ("gear_variant_id") REFERENCES "GearVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearVariant" ADD CONSTRAINT "GearVariant_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearPack" ADD CONSTRAINT "GearPack_derived_from_gear_pack_id_fkey" FOREIGN KEY ("derived_from_gear_pack_id") REFERENCES "GearPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearPackTemplate" ADD CONSTRAINT "GearPackTemplate_gear_pack_id_fkey" FOREIGN KEY ("gear_pack_id") REFERENCES "GearPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearPackComponent" ADD CONSTRAINT "GearPackComponent_gear_pack_template_id_fkey" FOREIGN KEY ("gear_pack_template_id") REFERENCES "GearPackTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearPackComponent" ADD CONSTRAINT "GearPackComponent_gear_type_id_fkey" FOREIGN KEY ("gear_type_id") REFERENCES "GearType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
