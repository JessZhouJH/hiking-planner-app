-- DropIndex
DROP INDEX "Alias_target_object_type_target_object_id_alias_key";

-- DropIndex
DROP INDEX "Attachment_target_object_type_target_object_id_attachment_u_key";

-- DropIndex
DROP INDEX "Brand_name_key";

-- DropIndex
DROP INDEX "DescriptiveGear_name_key";

-- DropIndex
DROP INDEX "DescriptiveGear_name_owner_id_key";

-- DropIndex
DROP INDEX "Gear_name_owner_id_key";

-- DropIndex
DROP INDEX "GearPack_name_owner_id_key";

-- DropIndex
DROP INDEX "GearTagRelation_gear_id_tag_id_key";

-- DropIndex
DROP INDEX "GearType_name_key";

-- DropIndex
DROP INDEX "GearVariant_gear_id_gear_variant_name_key";

-- DropIndex
DROP INDEX "Permission_name_key";

-- DropIndex
DROP INDEX "Role_name_key";

-- DropIndex
DROP INDEX "Tag_name_key";

-- DropIndex
DROP INDEX "TagGroup_name_key";

-- DropIndex
DROP INDEX "Unit_name_key";

-- CreateIndex
CREATE INDEX "Alias_target_object_type_target_object_id_alias_idx" ON "Alias"("target_object_type", "target_object_id", "alias");

-- CreateIndex
CREATE INDEX "Attachment_target_object_type_target_object_id_attachment_u_idx" ON "Attachment"("target_object_type", "target_object_id", "attachment_usage", "media_archive_id");

-- CreateIndex
CREATE INDEX "Brand_name_idx" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "DescriptiveGear_name_owner_id_idx" ON "DescriptiveGear"("name", "owner_id");

-- CreateIndex
CREATE INDEX "Gear_name_owner_id_idx" ON "Gear"("name", "owner_id");

-- CreateIndex
CREATE INDEX "GearPack_name_owner_id_idx" ON "GearPack"("name", "owner_id");

-- CreateIndex
CREATE INDEX "GearPackComponent_gear_pack_id_gear_type_id_descriptive_gea_idx" ON "GearPackComponent"("gear_pack_id", "gear_type_id", "descriptive_gear_id");

-- CreateIndex
CREATE INDEX "GearSpecs_gear_id_gear_variant_id_gear_specs_definition_id_idx" ON "GearSpecs"("gear_id", "gear_variant_id", "gear_specs_definition_id");

-- CreateIndex
CREATE INDEX "GearTagRelation_gear_id_tag_id_idx" ON "GearTagRelation"("gear_id", "tag_id");

-- CreateIndex
CREATE INDEX "GearType_name_idx" ON "GearType"("name");

-- CreateIndex
CREATE INDEX "GearTypeRelation_parent_gear_type_id_child_gear_type_id_idx" ON "GearTypeRelation"("parent_gear_type_id", "child_gear_type_id");

-- CreateIndex
CREATE INDEX "GearVariant_gear_id_gear_variant_name_idx" ON "GearVariant"("gear_id", "gear_variant_name");

-- CreateIndex
CREATE INDEX "Permission_name_idx" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE INDEX "RolePermission_role_id_permission_id_idx" ON "RolePermission"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "TagGroup_name_idx" ON "TagGroup"("name");

-- CreateIndex
CREATE INDEX "TagGroupRelation_tag_group_id_tag_id_idx" ON "TagGroupRelation"("tag_group_id", "tag_id");

-- CreateIndex
CREATE INDEX "TagRelation_parent_tag_id_child_tag_id_idx" ON "TagRelation"("parent_tag_id", "child_tag_id");

-- CreateIndex
CREATE INDEX "Unit_name_idx" ON "Unit"("name");

-- CreateIndex
CREATE INDEX "UserRole_user_id_role_id_idx" ON "UserRole"("user_id", "role_id");
