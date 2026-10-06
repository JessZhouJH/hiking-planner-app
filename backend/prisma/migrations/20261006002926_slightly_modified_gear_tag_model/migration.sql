-- AlterTable
ALTER TABLE "GearTag" ADD COLUMN     "parent_gear_tag_id" INTEGER;

-- AddForeignKey
ALTER TABLE "GearTag" ADD CONSTRAINT "GearTag_parent_gear_tag_id_fkey" FOREIGN KEY ("parent_gear_tag_id") REFERENCES "GearTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
