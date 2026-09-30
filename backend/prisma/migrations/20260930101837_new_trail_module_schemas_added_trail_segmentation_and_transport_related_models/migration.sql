/*
  Warnings:

  - You are about to drop the column `canonicalization_consent_at` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `canonicalization_consent_id` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `canonicalized_at` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `canonicalized_by_id` on the `AccessPoint` table. All the data in the column will be lost.
  - Added the required column `merge_reason` to the `AccessPoint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MergeReasons" AS ENUM ('DUPLICATE', 'TYPE', 'ABBRIVIATION', 'CASE_OR_SYMBOL_VARIANT', 'COVERAGE_OVERLAP', 'REPLACED_BY_CANONICAL_RECORD', 'OTHER');

-- CreateEnum
CREATE TYPE "RecordOperationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('UNSPECIFIED', 'TRAIN', 'BUS', 'COACH', 'FERRY', 'SHUTTLE_LAND', 'SHUTTLE_WATER', 'WATER_TAXI', 'PRIVATE_TRANSFER', 'DRIVE');

-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('UNSPECIFIED', 'TRIP_TO_TRAIL_DEP', 'TRIP_FROM_TRAIL_DEP', 'TRIP_TO_TRAIL_ARR', 'TRIP_FROM_TRAIL_ARR', 'TRANSIT', 'LOCAL');

-- CreateEnum
CREATE TYPE "BookingRequirement" AS ENUM ('UNSPECIFIED', 'REQUIRED', 'RECOMMENDED', 'OPTIONAL', 'NOT_REQUIRED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('UNSPECIFIED', 'AVAILABLE', 'RESTRICTED', 'UNAVAILABLE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "AccessPoint" DROP COLUMN "canonicalization_consent_at",
DROP COLUMN "canonicalization_consent_id",
DROP COLUMN "canonicalized_at",
DROP COLUMN "canonicalized_by_id",
ADD COLUMN     "canonical_proposal_consent_at" TIMESTAMP(3),
ADD COLUMN     "canonical_proposal_consent_by_id" INTEGER,
ADD COLUMN     "canonical_proposal_notes" TEXT,
ADD COLUMN     "canonical_proposal_resolved_at" TIMESTAMP(3),
ADD COLUMN     "canonical_proposal_resolved_by_id" INTEGER,
ADD COLUMN     "canonical_proposal_status" "RecordOperationStatus",
ADD COLUMN     "canonical_proposed_at" TIMESTAMP(3),
ADD COLUMN     "canonical_proposed_by_id" INTEGER,
ADD COLUMN     "merge_notes" TEXT,
ADD COLUMN     "merge_reason" "MergeReasons" NOT NULL,
ADD COLUMN     "merge_status" "RecordOperationStatus",
ADD COLUMN     "merged_at" TIMESTAMP(3),
ADD COLUMN     "merged_by_id" INTEGER,
ADD COLUMN     "merged_into_id" INTEGER;

-- CreateTable
CREATE TABLE "TrailSegmentation" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "derived_from_segmentation_id" INTEGER,
    "name" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "edit_policy_override" "EditPolicyOverride" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TrailSegmentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailSegmentRelation" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "trail_segmentation_id" INTEGER NOT NULL,
    "child_trail_id" INTEGER NOT NULL,
    "child_trail_start_ap_id" INTEGER,
    "child_sequence" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TrailSegmentRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportService" (
    "id" SERIAL NOT NULL,
    "transprot_mode" "TransportMode" NOT NULL,
    "provider_name" TEXT,
    "service_name" TEXT,
    "start_ap_id" INTEGER,
    "start_ap_name" TEXT,
    "end_ap_id" INTEGER,
    "end_ap_name" TEXT,
    "transfer_type" "TransferType" NOT NULL,
    "booking_requirement" "BookingRequirement" NOT NULL DEFAULT 'UNSPECIFIED',
    "service_url" TEXT,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TransportService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportServiceCalendar" (
    "id" SERIAL NOT NULL,
    "transport_service_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "availability_status" "AvailabilityStatus" NOT NULL,
    "src_url" TEXT,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TransportServiceCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrailSegmentRelation_trail_segmentation_id_child_trail_id_key" ON "TrailSegmentRelation"("trail_segmentation_id", "child_trail_id");

-- CreateIndex
CREATE UNIQUE INDEX "TrailSegmentRelation_trail_segmentation_id_child_sequence_key" ON "TrailSegmentRelation"("trail_segmentation_id", "child_sequence");
