/*
  Warnings:

  - The values [UNSPEDICIFED] on the enum `FeasibilityTag` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `merged_into_ap_id` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `updaetd_by_id` on the `DifficultySystem` table. All the data in the column will be lost.
  - You are about to drop the column `require_gear_detail` on the `GearPackComponent` table. All the data in the column will be lost.
  - The `status` column on the `RolePermission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `trail_difficulty_converted_id` on the `TrailProfile` table. All the data in the column will be lost.
  - You are about to drop the column `trail_primary_geometry_id` on the `TrailProfile` table. All the data in the column will be lost.
  - You are about to drop the column `source_autority` on the `TrailSource` table. All the data in the column will be lost.
  - You are about to drop the column `trail_difficulty_system` on the `TrailSource` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_type` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `transprot_mode` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `last_reviewed_by` on the `UserFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `last_reviewed_by` on the `UserProposal` table. All the data in the column will be lost.
  - The `status` column on the `UserRole` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updated_by_id` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `DifficultySystem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transport_mode` to the `TransportService` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RBACStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MealPackCategory" AS ENUM ('UNSPECIFIED', 'BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'EMERGENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "AccommodationType" AS ENUM ('UNSPECIFIED', 'HUT', 'CAMPSITE', 'SHELTER', 'REFUGE', 'HOTEL', 'AIRBNB', 'PRIVATE_STAY', 'OTHER');

-- CreateEnum
CREATE TYPE "UserActionStatus" AS ENUM ('UNSPECIFIED', 'COMPLETED', 'NEED_TO_DO', 'NO_ACTION');

-- CreateEnum
CREATE TYPE "StayStatus" AS ENUM ('UNSPECIFIED', 'COMPLETED', 'ONGOING', 'NOT_STARTED', 'CANCELLED', 'OTHER');

-- CreateEnum
CREATE TYPE "PreparationStatus" AS ENUM ('UNSPECIFIED', 'READY', 'AWAITING_DELIVERY', 'NEED_TO_PREP');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('TIDE', 'SUNRISE', 'SUNSET', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UNSPECIFIED', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "FeasibilityTag_new" AS ENUM ('UNSPECIFIED', 'RECOMMENDED', 'WORKABLE', 'RESTRICGTED', 'PROHIBITED');
ALTER TABLE "public"."AccessPointCalendar" ALTER COLUMN "ap_feasibility" DROP DEFAULT;
ALTER TABLE "public"."TrailCalendar" ALTER COLUMN "trail_feasibility" DROP DEFAULT;
ALTER TABLE "TrailCalendar" ALTER COLUMN "trail_feasibility" TYPE "FeasibilityTag_new" USING ("trail_feasibility"::text::"FeasibilityTag_new");
ALTER TABLE "AccessPointCalendar" ALTER COLUMN "ap_feasibility" TYPE "FeasibilityTag_new" USING ("ap_feasibility"::text::"FeasibilityTag_new");
ALTER TYPE "FeasibilityTag" RENAME TO "FeasibilityTag_old";
ALTER TYPE "FeasibilityTag_new" RENAME TO "FeasibilityTag";
DROP TYPE "public"."FeasibilityTag_old";
ALTER TABLE "AccessPointCalendar" ALTER COLUMN "ap_feasibility" SET DEFAULT 'UNSPECIFIED';
ALTER TABLE "TrailCalendar" ALTER COLUMN "trail_feasibility" SET DEFAULT 'UNSPECIFIED';
COMMIT;

-- AlterTable
ALTER TABLE "AccessPoint" DROP COLUMN "merged_into_ap_id";

-- AlterTable
ALTER TABLE "AccessPointCalendar" ALTER COLUMN "ap_feasibility" SET DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "updated_by",
ADD COLUMN     "updated_by_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DifficultySystem" DROP COLUMN "updaetd_by_id",
ADD COLUMN     "updated_by_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GearPackComponent" DROP COLUMN "require_gear_detail",
ADD COLUMN     "requires_gear_detail" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "MealPack" ADD COLUMN     "meal_pack_category" "MealPackCategory" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "status",
ADD COLUMN     "status" "RBACStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "TrailCalendar" ALTER COLUMN "trail_feasibility" SET DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "TrailProfile" DROP COLUMN "trail_difficulty_converted_id",
DROP COLUMN "trail_primary_geometry_id",
ADD COLUMN     "primary_geometry_id" INTEGER,
ADD COLUMN     "trail_difficulty_converted" "NormalizedDifficulty";

-- AlterTable
ALTER TABLE "TrailSource" DROP COLUMN "source_autority",
DROP COLUMN "trail_difficulty_system",
ADD COLUMN     "source_authority" "SourceAuthority" NOT NULL DEFAULT 'UNSPECIFIED',
ADD COLUMN     "trail_difficulty_system_id" INTEGER;

-- AlterTable
ALTER TABLE "TransportService" DROP COLUMN "transfer_type",
DROP COLUMN "transprot_mode",
ADD COLUMN     "transport_mode" "TransportMode" NOT NULL;

-- AlterTable
ALTER TABLE "UserFeedback" DROP COLUMN "last_reviewed_by",
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "UserGear" ALTER COLUMN "purchased_date" DROP NOT NULL,
ALTER COLUMN "retired_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserProposal" DROP COLUMN "last_reviewed_by",
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "status",
ADD COLUMN     "status" "RBACStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "StatusRBAC";

-- CreateTable
CREATE TABLE "TripAccommodation" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER,
    "trip_trail_id" INTEGER,
    "accom_name" TEXT NOT NULL,
    "accom_type" "AccommodationType" NOT NULL,
    "trail_facility_id" INTEGER,
    "access_point_id" INTEGER,
    "stay_date" DATE,
    "stay_nights" INTEGER,
    "booking_requirement" "BookingRequirement" NOT NULL DEFAULT 'UNSPECIFIED',
    "booking_status" "UserActionStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "need_sleeping_system" BOOLEAN,
    "need_tent" BOOLEAN,
    "need_cookware" BOOLEAN,
    "need_dineware" BOOLEAN,
    "stay_status" "StayStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TripAccommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripGearList" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "gear_type_id" INTEGER,
    "user_gear_id" INTEGER,
    "gear_description" TEXT,
    "prep_status" "PreparationStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TripGearList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripMealPack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "meal_pack_id" INTEGER NOT NULL,
    "meal_pack_qty" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TripMealPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripMealPackItem" (
    "id" SERIAL NOT NULL,
    "trip_meal_pack_id" INTEGER NOT NULL,
    "meal_item_id" INTEGER NOT NULL,
    "meal_item_qty" INTEGER NOT NULL DEFAULT 1,
    "prep_status" "PreparationStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TripMealPackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripTrail" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "trail_sequence" INTEGER NOT NULL,
    "trail_start_date" DATE,
    "trail_end_date" DATE,
    "trail_profile_id" INTEGER,
    "trail_geometry_id" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TripTrail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripTransport" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "trip_trail_id" INTEGER,
    "transport_service_id" INTEGER,
    "transport_mode" "TransportMode",
    "transfer_type" "TransferType",
    "transport_date" DATE,
    "dep_ap_name" TEXT,
    "dep_ap_id" INTEGER,
    "dep_time" TIMESTAMP(3),
    "arr_ap_name" TEXT,
    "arr_ap_id" INTEGER,
    "arr_time" TIMESTAMP(3),
    "booking_status" "UserActionStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "booking_ref" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TripTransport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CriticalEvent" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "event_type" "EventType" NOT NULL,
    "event_status" "EventStatus" NOT NULL,
    "event_exact_time" TIMESTAMP(3),
    "event_start_time" TIMESTAMP(3),
    "event_end_time" TIMESTAMP(3),
    "event_loc_name" TEXT,
    "event_loc_ap_id" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "CriticalEvent_pkey" PRIMARY KEY ("id")
);
