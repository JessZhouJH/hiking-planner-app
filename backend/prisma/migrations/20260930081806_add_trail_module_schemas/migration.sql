/*
  Warnings:

  - A unique constraint covering the columns `[role_id,permission_id]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('EVIDENCE', 'SOURCE_DOCUMENT', 'SUPPORTING_MATERIAL', 'SCREENSHOT', 'PHOTO', 'GPX', 'MAP', 'RECEIPT', 'BOOKING_CONFIRMATION', 'FEEDBACK', 'OTHER');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('USER', 'ROLE', 'PERMISSION');

-- CreateEnum
CREATE TYPE "UnitCategory" AS ENUM ('UNSPECIFIED', 'WEIGHT', 'LENGTH', 'AREA', 'VOLUME', 'TEMPERATURE', 'DURATION', 'POWER', 'ENERGY', 'LUMINOUS_FLUX');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('UNSPECIFIED', 'PRIVATE', 'RESTRICTED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('UNSPECIFIED', 'WEIGHT', 'LENGTH', 'VOLUME', 'TEMPERATURE', 'R_VALUE', 'CAPACITY', 'FIT', 'SIZE', 'MATERIAL', 'COUNT', 'DURATION', 'POWER', 'ENERGY');

-- CreateEnum
CREATE TYPE "Operator" AS ENUM ('UNSPECIFIED', 'EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'RANGE');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('UNSPECIFIED', 'PER_DAY', 'PER_WEEK', 'PER_HIKE');

-- CreateEnum
CREATE TYPE "RequirementLevel" AS ENUM ('UNSPECIFIED', 'MANDATORY', 'RECOMMENDED', 'OPTIONAL');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('UNSPECIFIED', 'NONE', 'MONTH', 'SEASON', 'ALTITUDE', 'TEMPERATURE', 'TIDE');

-- CreateEnum
CREATE TYPE "TrailType" AS ENUM ('UNSPECIFIED', 'LOOP', 'OUT_AND_BACK', 'POINT_TO_POINT');

-- CreateEnum
CREATE TYPE "AuthenticityLevel" AS ENUM ('UNSPECIFIED', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "DataOrigin" AS ENUM ('UNSPEFICIED', 'MANUAL', 'IMPORTED', 'CACULATED', 'DERIVED');

-- CreateEnum
CREATE TYPE "EditPolicyOverride" AS ENUM ('UNSPECIFIED', 'ALLOWED', 'RESTRICTED', 'FORBIDDEN');

-- CreateEnum
CREATE TYPE "NormalizedDifficulty" AS ENUM ('UNSPECIFIED', 'EASY', 'MODERATE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "Accessibility" AS ENUM ('UNSPECIFIED');

-- CreateEnum
CREATE TYPE "DifficultyOrigin" AS ENUM ('UNSPECIFIED', 'SINGLE_CONVERTED', 'MULTI_CONVERTED', 'NO_CONVERSION', 'OTHER');

-- CreateEnum
CREATE TYPE "SeverityLevel" AS ENUM ('UNSPECIFIED', 'CRITICAL', 'EXTREME', 'HIGH', 'MODERATE', 'LOW');

-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('UNSPECIFIED', 'HUT', 'CAMPSITE', 'SHELTER', 'REFUGE', 'VISITOR_OFFICE', 'RANGER_HOUSE');

-- CreateEnum
CREATE TYPE "SourceAuthority" AS ENUM ('UNSPECIFIED', 'OFFICIAL', 'DIRECT_PROVIDER', 'PROFESSION', 'COMMUNITY', 'PERSONAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SourceConfidence" AS ENUM ('UNSPECIFIED', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "FeasibilityTag" AS ENUM ('UNSPEDICIFED', 'RECOMMENDED', 'WORKABLE', 'RESTRICGTED', 'PROHIBITED');

-- CreateEnum
CREATE TYPE "SeasonalityStatus" AS ENUM ('UNSPECIFIED', 'UNKNOWN', 'NON_SEASONAL', 'SEASONAL');

-- CreateEnum
CREATE TYPE "AccessPointRole" AS ENUM ('UNSPECIFIED', 'START', 'END', 'WAYPOINT', 'ACCESS', 'TRANSPORT_HUB', 'RESUPPLY', 'FACILITY', 'OTHER');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'UNSPECIFIED';

-- CreateTable
CREATE TABLE "Alias" (
    "id" SERIAL NOT NULL,
    "target_type" "TargetType" NOT NULL,
    "target_id" INTEGER NOT NULL,
    "alias" TEXT NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "Alias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "attach_to_type" "TargetType" NOT NULL,
    "attach_to_id" INTEGER NOT NULL,
    "media_id" INTEGER,
    "attachment_type" "AttachmentType" NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "media_key" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "symbol" TEXT,
    "category" "UnitCategory" NOT NULL,
    "is_base" BOOLEAN NOT NULL DEFAULT false,
    "scale_to_base" DOUBLE PRECISION,
    "offset_to_base" DOUBLE PRECISION,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gear" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand_id" INTEGER,
    "gear_type_id" INTEGER NOT NULL,
    "preview_img_key" TEXT,
    "owner_id" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "Gear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearSpecsDefinition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gear_type_id" INTEGER NOT NULL,
    "value_type" "ValueType" NOT NULL,
    "default_unit_id" INTEGER,
    "is_critical" BOOLEAN NOT NULL DEFAULT false,
    "is_variant_sensitive" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearSpecsDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearSpecs" (
    "id" SERIAL NOT NULL,
    "gear_id" INTEGER NOT NULL,
    "gear_variant_id" INTEGER,
    "gear_specs_definition_id" INTEGER NOT NULL,
    "source_unit_id" INTEGER,
    "value_boolean" BOOLEAN,
    "value_text" TEXT,
    "value_numeric_1" DOUBLE PRECISION,
    "value_numeric_2" DOUBLE PRECISION,
    "operator" "Operator",
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearSpecs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearFeature" (
    "id" SERIAL NOT NULL,
    "gear_id" INTEGER NOT NULL,
    "gear_variant_id" INTEGER,
    "name" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearVariant" (
    "id" SERIAL NOT NULL,
    "gear_id" INTEGER NOT NULL,
    "gear_variant_name" TEXT NOT NULL,
    "is_technical_variant" BOOLEAN NOT NULL DEFAULT false,
    "variant_preview_img_key" TEXT,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearPack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_universal" BOOLEAN,
    "derived_from_gear_pack_id" INTEGER,
    "owner_id" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "GearPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearPackTemplate" (
    "id" SERIAL NOT NULL,
    "gear_pack_id" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearPackTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearPackComponent" (
    "id" SERIAL NOT NULL,
    "gear_pack_template_id" INTEGER NOT NULL,
    "gear_type_id" INTEGER,
    "gear_description" TEXT,
    "require_gear_detail" BOOLEAN NOT NULL DEFAULT true,
    "default_frequency" "Frequency",
    "default_qty" INTEGER,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearPackComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_time_dependent" BOOLEAN,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeGearRequirement" (
    "id" SERIAL NOT NULL,
    "challenge_id" INTEGER NOT NULL,
    "gear_type_id" INTEGER NOT NULL,
    "gear_specs_def_id" INTEGER,
    "requirement_level" "RequirementLevel" NOT NULL DEFAULT 'UNSPECIFIED',
    "requirement_value" TEXT,
    "requirement_operator" "Operator",
    "condition_type" "ConditionType" NOT NULL DEFAULT 'UNSPECIFIED',
    "condition_value" TEXT,
    "condition_operator" "Operator",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "ChallengeGearRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DifficultySystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "src" TEXT,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updaetd_by_id" INTEGER NOT NULL,

    CONSTRAINT "DifficultySystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DifficultyMapping" (
    "id" SERIAL NOT NULL,
    "difficulty_system_id" INTEGER NOT NULL,
    "raw_difficulty" TEXT,
    "normalized_difficulty" "NormalizedDifficulty" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "DifficultyMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trail" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "primary_profile_id" INTEGER,
    "region" TEXT,
    "country" TEXT,
    "is_trail_root" BOOLEAN NOT NULL DEFAULT false,
    "trail_origin" "DataOrigin" NOT NULL,
    "authenticity_level" "AuthenticityLevel" NOT NULL DEFAULT 'UNSPECIFIED',
    "derived_from_id" INTEGER,
    "owner_id" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "edit_policy_override" "EditPolicyOverride" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "Trail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailSource" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "trail_difficulty_system" INTEGER,
    "is_trail_primary_src" BOOLEAN NOT NULL DEFAULT false,
    "source_name" TEXT,
    "source_url" TEXT,
    "source_media_id" INTEGER,
    "source_autority" "SourceAuthority" NOT NULL DEFAULT 'UNSPECIFIED',
    "source_confidence" "SourceConfidence" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TrailSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailChallenge" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "challenge_id" INTEGER NOT NULL,
    "severity_level" "SeverityLevel" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TrailChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailDifficulty" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "trail_source_id" INTEGER,
    "difficulty_raw" TEXT,
    "difficulty_normalized" "NormalizedDifficulty" NOT NULL,
    "difficulty_converted" "NormalizedDifficulty" NOT NULL,
    "difficulty_origin" "DifficultyOrigin" NOT NULL DEFAULT 'UNSPECIFIED',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,
    "verifier_notes" TEXT,

    CONSTRAINT "TrailDifficulty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailFacility" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "facility_type" "FacilityType",
    "trail_source_id" INTEGER,
    "media_id" INTEGER,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TrailFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailCalendar" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "trail_feasibility" "FeasibilityTag" NOT NULL DEFAULT 'UNSPEDICIFED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TrailCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailUse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TrailUse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailProfile" (
    "id" SERIAL NOT NULL,
    "trail_type" "TrailType",
    "trail_id" INTEGER NOT NULL,
    "trail_primary_geometry_id" INTEGER,
    "distance" DOUBLE PRECISION,
    "elevation_gain" DOUBLE PRECISION,
    "elevation_loss" DOUBLE PRECISION,
    "duration_hr" DOUBLE PRECISION,
    "duration_hr_calculated" DOUBLE PRECISION,
    "duration_day" INTEGER,
    "trail_difficulty_converted_id" INTEGER,
    "accessibility" "Accessibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "accessibility_notes" TEXT,
    "profile_origin" "DataOrigin" NOT NULL,
    "authenticity_level" "AuthenticityLevel" NOT NULL DEFAULT 'UNSPECIFIED',
    "owner_id" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "edit_policy_override" "EditPolicyOverride" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TrailProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailProfileUse" (
    "id" SERIAL NOT NULL,
    "trail_profile_id" INTEGER NOT NULL,
    "trail_use_id" INTEGER NOT NULL,
    "condition_type" "ConditionType",
    "condition_operator" "Operator",
    "condition_value" TEXT,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TrailProfileUse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailGearRequirement" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "gear_type_id" INTEGER NOT NULL,
    "gear_specs_definition_id" INTEGER,
    "requirement_level" "RequirementLevel" NOT NULL DEFAULT 'UNSPECIFIED',
    "requirement_operator" "Operator" NOT NULL DEFAULT 'UNSPECIFIED',
    "requirement_value" TEXT NOT NULL,
    "condition_type" "ConditionType",
    "condition_operator" "Operator",
    "condition_value" TEXT,
    "requirement_source_id" INTEGER,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "TrailGearRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessPoint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "facility_id" INTEGER,
    "seasonality_status" "SeasonalityStatus",
    "point_lat" DOUBLE PRECISION,
    "point_lng" DOUBLE PRECISION,
    "merged_into_ap_id" INTEGER,
    "owner_id" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "is_canonical" BOOLEAN NOT NULL DEFAULT false,
    "canonicalized_at" TIMESTAMP(3),
    "canonicalized_by_id" INTEGER,
    "canonicalization_consent_at" TIMESTAMP(3),
    "canonicalization_consent_id" INTEGER,
    "edit_policy_override" "EditPolicyOverride" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "AccessPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessPointCalendar" (
    "id" SERIAL NOT NULL,
    "access_point_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "ap_feasibility" "FeasibilityTag" NOT NULL DEFAULT 'UNSPEDICIFED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "AccessPointCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailAccessPointRelation" (
    "id" SERIAL NOT NULL,
    "ap_id" INTEGER NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "ap_role" "AccessPointRole",
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TrailAccessPointRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailGeometry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "start_ap_id" INTEGER NOT NULL,
    "end_ap_id" INTEGER NOT NULL,
    "gpx_fpath_key" TEXT,
    "gpx_fname" TEXT,
    "gpx_src_url" TEXT,
    "geometry_origin" "DataOrigin" NOT NULL,
    "derived_from_id" INTEGER,
    "authenticity_level" "AuthenticityLevel" NOT NULL DEFAULT 'UNSPECIFIED',
    "owner_id" INTEGER,
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
    "last_calculated_at" TIMESTAMP(3),

    CONSTRAINT "TrailGeometry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alias_target_type_target_id_alias_key" ON "Alias"("target_type", "target_id", "alias");

-- CreateIndex
CREATE UNIQUE INDEX "Media_media_key_key" ON "Media"("media_key");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GearType_name_key" ON "GearType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GearSpecsDefinition_gear_type_id_name_key" ON "GearSpecsDefinition"("gear_type_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "GearSpecs_gear_id_gear_variant_id_gear_specs_definition_id_key" ON "GearSpecs"("gear_id", "gear_variant_id", "gear_specs_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "GearPackTemplate_gear_pack_id_key" ON "GearPackTemplate"("gear_pack_id");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_id_permission_id_key" ON "RolePermission"("role_id", "permission_id");
