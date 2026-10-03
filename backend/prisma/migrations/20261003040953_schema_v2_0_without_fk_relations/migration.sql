/*
  Warnings:

  - You are about to drop the column `ap_feasibility` on the `AccessPointCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `gear_specs_def_id` on the `ChallengeGearRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `target_root_id` on the `CommunityPublication` table. All the data in the column will be lost.
  - You are about to drop the column `target_object_id` on the `CommunityPublicationItem` table. All the data in the column will be lost.
  - You are about to drop the column `event_loc_ap_id` on the `CriticalEvent` table. All the data in the column will be lost.
  - You are about to drop the column `src` on the `DifficultySystem` table. All the data in the column will be lost.
  - You are about to drop the column `is_critical` on the `GearSpecsDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `derived_from_id` on the `Trail` table. All the data in the column will be lost.
  - You are about to drop the column `ap_id` on the `TrailAccessPointRelation` table. All the data in the column will be lost.
  - You are about to drop the column `ap_role` on the `TrailAccessPointRelation` table. All the data in the column will be lost.
  - You are about to drop the column `last_verified_at` on the `TrailGearRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `last_verified_by_id` on the `TrailGearRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `requirement_source_id` on the `TrailGearRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `end_ap_id` on the `TrailGeometry` table. All the data in the column will be lost.
  - You are about to drop the column `gpx_fname` on the `TrailGeometry` table. All the data in the column will be lost.
  - You are about to drop the column `gpx_fpath_key` on the `TrailGeometry` table. All the data in the column will be lost.
  - You are about to drop the column `start_ap_id` on the `TrailGeometry` table. All the data in the column will be lost.
  - You are about to drop the column `child_trail_start_ap_id` on the `TrailSegmentRelation` table. All the data in the column will be lost.
  - You are about to drop the column `is_trail_primary_src` on the `TrailSource` table. All the data in the column will be lost.
  - You are about to drop the column `trail_difficulty_system_id` on the `TrailSource` table. All the data in the column will be lost.
  - You are about to drop the column `end_ap_id` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `end_ap_name` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `start_ap_id` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `start_ap_name` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `arr_ap_id` on the `TripTransport` table. All the data in the column will be lost.
  - You are about to drop the column `arr_ap_name` on the `TripTransport` table. All the data in the column will be lost.
  - You are about to drop the column `dep_ap_id` on the `TripTransport` table. All the data in the column will be lost.
  - You are about to drop the column `dep_ap_name` on the `TripTransport` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `UserGearPack` table. All the data in the column will be lost.
  - You are about to drop the column `is_ready` on the `UserGearPackItem` table. All the data in the column will be lost.
  - You are about to drop the `UserReminder` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `seasonality_status` on table `AccessPoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_time_dependent` on table `Challenge` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `source_object_id` to the `CommunityPublicationItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `raw_difficulty` on table `DifficultyMapping` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_universal` on table `GearPack` required. This step will fail if there are existing NULL values in that column.
  - Made the column `default_frequency` on table `GearPackComponent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `default_qty` on table `GearPackComponent` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `access_pointid` to the `TrailAccessPointRelation` table without a default value. This is not possible if the table is not empty.
  - Made the column `condition_type` on table `TrailGearRequirement` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `end_access_pointid` to the `TrailGeometry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_access_pointid` to the `TrailGeometry` table without a default value. This is not possible if the table is not empty.
  - Made the column `trip_id` on table `TripAccommodation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `target_object_id` on table `UserPersonalArchive` required. This step will fail if there are existing NULL values in that column.
  - Made the column `target_object_type` on table `UserPersonalArchive` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProductionStatus" AS ENUM ('UNSPECIFIED', 'ACTIVE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "ChecklistStatus" AS ENUM ('UNSPECIFIED', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ChecklistItemType" AS ENUM ('UNSPECIFIED', 'GEAR', 'MEAL', 'BOOKING_TRANSPORT', 'BOOKING_ACCOMMODATION', 'BOOKING_PERMITS', 'DOCUMENTS');

-- DropIndex
DROP INDEX "GearSpecsDefinition_gear_type_id_name_key";

-- AlterTable
ALTER TABLE "AccessPoint" ALTER COLUMN "seasonality_status" SET NOT NULL,
ALTER COLUMN "seasonality_status" SET DEFAULT 'UNSPECIFIED',
ALTER COLUMN "merge_reason" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AccessPointCalendar" DROP COLUMN "ap_feasibility",
ADD COLUMN     "access_pointfeasibility" "FeasibilityTag" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "is_time_dependent" SET NOT NULL,
ALTER COLUMN "is_time_dependent" SET DEFAULT false;

-- AlterTable
ALTER TABLE "ChallengeGearRequirement" DROP COLUMN "gear_specs_def_id",
ADD COLUMN     "gear_specs_definition_id" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "review_status" "UserProposalStatus" NOT NULL DEFAULT 'UNSPECIFIED',
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "CollectionItem" ADD COLUMN     "item_review_status" "UserProposalStatus" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "CommunityPublication" DROP COLUMN "target_root_id",
ADD COLUMN     "source_root_object_id" INTEGER;

-- AlterTable
ALTER TABLE "CommunityPublicationItem" DROP COLUMN "target_object_id",
ADD COLUMN     "source_object_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CriticalEvent" DROP COLUMN "event_loc_ap_id",
ADD COLUMN     "event_loc_access_point_id" INTEGER,
ALTER COLUMN "event_status" SET DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "DifficultyMapping" ALTER COLUMN "raw_difficulty" SET NOT NULL;

-- AlterTable
ALTER TABLE "DifficultySystem" DROP COLUMN "src",
ADD COLUMN     "source_url" TEXT;

-- AlterTable
ALTER TABLE "Gear" ADD COLUMN     "production_status" "ProductionStatus" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "GearPack" ALTER COLUMN "is_universal" SET NOT NULL,
ALTER COLUMN "is_universal" SET DEFAULT false;

-- AlterTable
ALTER TABLE "GearPackComponent" ALTER COLUMN "default_frequency" SET NOT NULL,
ALTER COLUMN "default_frequency" SET DEFAULT 'PER_TRIP',
ALTER COLUMN "default_qty" SET NOT NULL,
ALTER COLUMN "default_qty" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "GearSpecsDefinition" DROP COLUMN "is_critical",
ADD COLUMN     "is_key_spec" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MealItem" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "MealPack" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "MealPackItem" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Trail" DROP COLUMN "derived_from_id",
ADD COLUMN     "derived_from_trail_id" INTEGER,
ALTER COLUMN "trail_origin" SET DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "TrailAccessPointRelation" DROP COLUMN "ap_id",
DROP COLUMN "ap_role",
ADD COLUMN     "access_pointid" INTEGER NOT NULL,
ADD COLUMN     "access_pointrole" "AccessPointRole" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "TrailGearRequirement" DROP COLUMN "last_verified_at",
DROP COLUMN "last_verified_by_id",
DROP COLUMN "requirement_source_id",
ADD COLUMN     "trail_source_id" INTEGER,
ALTER COLUMN "requirement_operator" DROP NOT NULL,
ALTER COLUMN "requirement_value" DROP NOT NULL,
ALTER COLUMN "condition_type" SET NOT NULL,
ALTER COLUMN "condition_type" SET DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "TrailGeometry" DROP COLUMN "end_ap_id",
DROP COLUMN "gpx_fname",
DROP COLUMN "gpx_fpath_key",
DROP COLUMN "start_ap_id",
ADD COLUMN     "end_access_pointid" INTEGER NOT NULL,
ADD COLUMN     "gpx_file_key" TEXT,
ADD COLUMN     "gpx_file_name" TEXT,
ADD COLUMN     "start_access_pointid" INTEGER NOT NULL,
ALTER COLUMN "geometry_origin" SET DEFAULT 'UNSPECIFIED',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "TrailSegmentRelation" DROP COLUMN "child_trail_start_ap_id",
ADD COLUMN     "child_start_access_pointid" INTEGER;

-- AlterTable
ALTER TABLE "TrailSegmentation" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "TrailSource" DROP COLUMN "is_trail_primary_src",
DROP COLUMN "trail_difficulty_system_id",
ADD COLUMN     "difficulty_system_id" INTEGER,
ADD COLUMN     "is_primary_src" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TransportService" DROP COLUMN "end_ap_id",
DROP COLUMN "end_ap_name",
DROP COLUMN "start_ap_id",
DROP COLUMN "start_ap_name",
ADD COLUMN     "end_access_pointid" INTEGER,
ADD COLUMN     "end_access_pointname" TEXT,
ADD COLUMN     "start_access_pointid" INTEGER,
ADD COLUMN     "start_access_pointname" TEXT,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "transport_mode" SET DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "TransportServiceCalendar" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "TripAccommodation" ALTER COLUMN "trip_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "TripGearList" ADD COLUMN     "user_gear_qty" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TripMealPack" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TripMealPackItem" ADD COLUMN     "meal_item_description" TEXT,
ALTER COLUMN "meal_item_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TripTransport" DROP COLUMN "arr_ap_id",
DROP COLUMN "arr_ap_name",
DROP COLUMN "dep_ap_id",
DROP COLUMN "dep_ap_name",
ADD COLUMN     "arr_access_point_id" INTEGER,
ADD COLUMN     "arr_access_point_name" TEXT,
ADD COLUMN     "booking_requirement" "BookingRequirement" NOT NULL DEFAULT 'UNSPECIFIED',
ADD COLUMN     "dep_access_point_id" INTEGER,
ADD COLUMN     "dep_access_point_name" TEXT;

-- AlterTable
ALTER TABLE "UserGear" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "UserGearPack" DROP COLUMN "name",
ADD COLUMN     "gear_pack_suffix" TEXT NOT NULL DEFAULT 'general',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "UserGearPackItem" DROP COLUMN "is_ready",
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "UserPersonalArchive" ALTER COLUMN "source_type" SET DEFAULT 'UNSPECIFIED',
ALTER COLUMN "target_object_id" SET NOT NULL,
ALTER COLUMN "target_object_type" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserProposal" ADD COLUMN     "review_status" "UserProposalStatus" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "UserTrail" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "UserTrailCompletion" ALTER COLUMN "completed_at" SET DATA TYPE DATE;

-- DropTable
DROP TABLE "UserReminder";

-- CreateTable
CREATE TABLE "TripChecklist" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "checklist_status" "ChecklistStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TripChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripChecklistItem" (
    "id" SERIAL NOT NULL,
    "trip_checklist_id" INTEGER NOT NULL,
    "checklist_item_type" "ChecklistItemType" NOT NULL DEFAULT 'UNSPECIFIED',
    "checklist_item_id" INTEGER,
    "checklist_item_description" TEXT,
    "checklist_item_status" "ChecklistStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TripChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GearSpecsDefinition_gear_type_id_name_idx" ON "GearSpecsDefinition"("gear_type_id", "name");
