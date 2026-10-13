/*
  Warnings:

  - You are about to drop the column `symbol` on the `Unit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GearType" ADD COLUMN     "parent_gear_type_id" INTEGER;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "symbol",
ALTER COLUMN "display_name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GearTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearTagRelation" (
    "id" SERIAL NOT NULL,
    "gear_id" INTEGER NOT NULL,
    "gear_tag_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearTagRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GearTag_name_key" ON "GearTag"("name");

-- AddForeignKey
ALTER TABLE "GearType" ADD CONSTRAINT "GearType_parent_gear_type_id_fkey" FOREIGN KEY ("parent_gear_type_id") REFERENCES "GearType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTag" ADD CONSTRAINT "GearTag_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTag" ADD CONSTRAINT "GearTag_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTagRelation" ADD CONSTRAINT "GearTagRelation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTagRelation" ADD CONSTRAINT "GearTagRelation_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTagRelation" ADD CONSTRAINT "GearTagRelation_gear_tag_id_fkey" FOREIGN KEY ("gear_tag_id") REFERENCES "GearTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTagRelation" ADD CONSTRAINT "GearTagRelation_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
