/*
  Warnings:

  - You are about to drop the column `trail_id` on the `TrailFacility` table. All the data in the column will be lost.
  - Added the required column `name` to the `TrailFacility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `TrailFacility` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TargetWithOwnerType" AS ENUM ('GEAR', 'DESCRIPTIVE_GEAR', 'GEAR_PACK', 'TRAIL', 'TRAIL_PROFILE', 'ACCESS_POINT', 'TRAIL_GEOMETRY', 'TRAIL_SEGMENTATION', 'MEAL_PACK', 'MEAL_ITEM', 'COLLECITON');

-- DropForeignKey
ALTER TABLE "TrailFacility" DROP CONSTRAINT "TrailFacility_trail_id_fkey";

-- AlterTable
ALTER TABLE "TrailFacility" DROP COLUMN "trail_id",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "owner_id" INTEGER NOT NULL,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED';

-- CreateTable
CREATE TABLE "TrailFacilityRelation" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "trail_facility_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_verified_by_id" INTEGER,
    "last_verified_at" TIMESTAMP(3),

    CONSTRAINT "TrailFacilityRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrailFacility" ADD CONSTRAINT "TrailFacility_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailFacilityRelation" ADD CONSTRAINT "TrailFacilityRelation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailFacilityRelation" ADD CONSTRAINT "TrailFacilityRelation_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailFacilityRelation" ADD CONSTRAINT "TrailFacilityRelation_last_verified_by_id_fkey" FOREIGN KEY ("last_verified_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
