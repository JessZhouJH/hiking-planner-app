/*
  Warnings:

  - The values [FEEDBACK] on the enum `AttachmentUsage` will be removed. If these variants are still used in the database, this will fail.
  - The values [SINGLE_CONVERTED,MULTI_CONVERTED] on the enum `DifficultyOrigin` will be removed. If these variants are still used in the database, this will fail.
  - The values [RESTRICGTED] on the enum `FeasibilityTag` will be removed. If these variants are still used in the database, this will fail.
  - The values [PER_HIKE] on the enum `Frequency` will be removed. If these variants are still used in the database, this will fail.
  - The values [ABBRIVIATION] on the enum `MergeReasons` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROFESSION] on the enum `SourceAuthority` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `verified_at` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `AccessPointCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `AccessPointCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `ChallengeGearRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `ChallengeGearRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `Gear` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `Gear` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `GearPack` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `GearPack` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `MealItem` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `MealItem` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `Trail` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `Trail` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailChallenge` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailChallenge` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailDifficulty` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailDifficulty` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailFacility` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailFacility` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailGearRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailGearRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailGeometry` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailGeometry` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailProfile` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailProfile` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailProfileUse` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailProfileUse` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TrailSegmentation` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TrailSegmentation` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `verified_at` on the `TransportServiceCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by_id` on the `TransportServiceCalendar` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AttachmentUsage_new" AS ENUM ('EVIDENCE', 'SOURCE_DOCUMENT', 'SUPPORTING_MATERIAL', 'REFERENCE', 'RECEIPT', 'BOOKING_CONFIRMATION', 'OTHER');
ALTER TABLE "Attachment" ALTER COLUMN "attachment_usage" TYPE "AttachmentUsage_new" USING ("attachment_usage"::text::"AttachmentUsage_new");
ALTER TABLE "CommunityPublicationAttachment" ALTER COLUMN "attachment_usage" TYPE "AttachmentUsage_new" USING ("attachment_usage"::text::"AttachmentUsage_new");
ALTER TYPE "AttachmentUsage" RENAME TO "AttachmentUsage_old";
ALTER TYPE "AttachmentUsage_new" RENAME TO "AttachmentUsage";
DROP TYPE "public"."AttachmentUsage_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DataOrigin" ADD VALUE 'SYSTEM_GENERATED';
ALTER TYPE "DataOrigin" ADD VALUE 'EXTRACTED';

-- AlterEnum
BEGIN;
CREATE TYPE "DifficultyOrigin_new" AS ENUM ('UNSPECIFIED', 'SINGLE_SOURCE_CONVERTED', 'MULTI_SOURCE_CONVERTED', 'MANUAL', 'NO_CONVERSION', 'OTHER');
ALTER TABLE "public"."TrailDifficulty" ALTER COLUMN "difficulty_origin" DROP DEFAULT;
ALTER TABLE "TrailDifficulty" ALTER COLUMN "difficulty_origin" TYPE "DifficultyOrigin_new" USING ("difficulty_origin"::text::"DifficultyOrigin_new");
ALTER TYPE "DifficultyOrigin" RENAME TO "DifficultyOrigin_old";
ALTER TYPE "DifficultyOrigin_new" RENAME TO "DifficultyOrigin";
DROP TYPE "public"."DifficultyOrigin_old";
ALTER TABLE "TrailDifficulty" ALTER COLUMN "difficulty_origin" SET DEFAULT 'UNSPECIFIED';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FacilityType" ADD VALUE 'TOILET';
ALTER TYPE "FacilityType" ADD VALUE 'WATER_SOURCE';
ALTER TYPE "FacilityType" ADD VALUE 'PICNIC_AREA';
ALTER TYPE "FacilityType" ADD VALUE 'COOKING_SHELTER';
ALTER TYPE "FacilityType" ADD VALUE 'PARKING';
ALTER TYPE "FacilityType" ADD VALUE 'OTHER';

-- AlterEnum
BEGIN;
CREATE TYPE "FeasibilityTag_new" AS ENUM ('UNSPECIFIED', 'RECOMMENDED', 'WORKABLE', 'RESTRICTED', 'PROHIBITED');
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

-- AlterEnum
BEGIN;
CREATE TYPE "Frequency_new" AS ENUM ('UNSPECIFIED', 'PER_DAY', 'PER_WEEK', 'PER_TRIP', 'PER_NIGHT');
ALTER TABLE "GearPackComponent" ALTER COLUMN "default_frequency" TYPE "Frequency_new" USING ("default_frequency"::text::"Frequency_new");
ALTER TABLE "MealPack" ALTER COLUMN "consumption_frequency" TYPE "Frequency_new" USING ("consumption_frequency"::text::"Frequency_new");
ALTER TABLE "MealPackItem" ALTER COLUMN "meal_item_frequency" TYPE "Frequency_new" USING ("meal_item_frequency"::text::"Frequency_new");
ALTER TABLE "UserGearPackItem" ALTER COLUMN "alt_frequency" TYPE "Frequency_new" USING ("alt_frequency"::text::"Frequency_new");
ALTER TYPE "Frequency" RENAME TO "Frequency_old";
ALTER TYPE "Frequency_new" RENAME TO "Frequency";
DROP TYPE "public"."Frequency_old";
COMMIT;

-- AlterEnum
ALTER TYPE "MediaArchiveType" ADD VALUE 'DOCUMENT';

-- AlterEnum
BEGIN;
CREATE TYPE "MergeReasons_new" AS ENUM ('DUPLICATE', 'TYPE', 'ABBREVIATION', 'CASE_OR_SYMBOL_VARIANT', 'COVERAGE_OVERLAP', 'REPLACED_BY_CANONICAL_RECORD', 'OTHER');
ALTER TABLE "AccessPoint" ALTER COLUMN "merge_reason" TYPE "MergeReasons_new" USING ("merge_reason"::text::"MergeReasons_new");
ALTER TYPE "MergeReasons" RENAME TO "MergeReasons_old";
ALTER TYPE "MergeReasons_new" RENAME TO "MergeReasons";
DROP TYPE "public"."MergeReasons_old";
COMMIT;

-- AlterEnum
ALTER TYPE "Operator" ADD VALUE 'APPROX';

-- AlterEnum
BEGIN;
CREATE TYPE "SourceAuthority_new" AS ENUM ('UNSPECIFIED', 'OFFICIAL', 'DIRECT_PROVIDER', 'PROFESSIONAL', 'COMMUNITY', 'PERSONAL', 'UNKNOWN');
ALTER TABLE "public"."TrailSource" ALTER COLUMN "source_authority" DROP DEFAULT;
ALTER TABLE "TrailSource" ALTER COLUMN "source_authority" TYPE "SourceAuthority_new" USING ("source_authority"::text::"SourceAuthority_new");
ALTER TYPE "SourceAuthority" RENAME TO "SourceAuthority_old";
ALTER TYPE "SourceAuthority_new" RENAME TO "SourceAuthority";
DROP TYPE "public"."SourceAuthority_old";
ALTER TABLE "TrailSource" ALTER COLUMN "source_authority" SET DEFAULT 'UNSPECIFIED';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SourceType" ADD VALUE 'OFFICIAL_DOCUMENT';
ALTER TYPE "SourceType" ADD VALUE 'API';
ALTER TYPE "SourceType" ADD VALUE 'USER_UPLOAD';
ALTER TYPE "SourceType" ADD VALUE 'OTHER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UnitCategory" ADD VALUE 'COUNT';
ALTER TYPE "UnitCategory" ADD VALUE 'SPEED';
ALTER TYPE "UnitCategory" ADD VALUE 'PRESSURE';
ALTER TYPE "UnitCategory" ADD VALUE 'PERCENTAGE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ValueType" ADD VALUE 'AREA';
ALTER TYPE "ValueType" ADD VALUE 'SPEED';
ALTER TYPE "ValueType" ADD VALUE 'LUMINOUS_FLUX';
ALTER TYPE "ValueType" ADD VALUE 'PRESSURE';
ALTER TYPE "ValueType" ADD VALUE 'PERCENTAGE';
ALTER TYPE "ValueType" ADD VALUE 'RATING';
ALTER TYPE "ValueType" ADD VALUE 'BOOLEAN';
ALTER TYPE "ValueType" ADD VALUE 'TEXT';

-- AlterTable
ALTER TABLE "AccessPoint" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "AccessPointCalendar" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id";

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "last_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "logo_img_key" TEXT;

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "ChallengeGearRequirement" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "CollectionItem" ADD COLUMN     "last_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "Gear" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "GearPack" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "MealItem" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id";

-- AlterTable
ALTER TABLE "MealPack" ADD COLUMN     "last_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "MediaArchive" ADD COLUMN     "last_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "Trail" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "end_point_name" TEXT,
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER,
ADD COLUMN     "start_point_name" TEXT;

-- AlterTable
ALTER TABLE "TrailAccessPointRelation" ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailCalendar" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id";

-- AlterTable
ALTER TABLE "TrailChallenge" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id";

-- AlterTable
ALTER TABLE "TrailDifficulty" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailFacility" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailGearRequirement" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailGeometry" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailProfile" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailProfileUse" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id";

-- AlterTable
ALTER TABLE "TrailSegmentRelation" ADD COLUMN     "last_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailSegmentation" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "last_reviewed_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TransportService" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id",
ADD COLUMN     "last_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verified_by_id" INTEGER;

-- AlterTable
ALTER TABLE "TransportServiceCalendar" DROP COLUMN "verified_at",
DROP COLUMN "verified_by_id";

-- CreateTable
CREATE TABLE "UserStickyNotes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_object_type" "TargetTypeSelected" NOT NULL,
    "target_object_id" INTEGER,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "pinned" BOOLEAN,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserStickyNotes_pkey" PRIMARY KEY ("id")
);
