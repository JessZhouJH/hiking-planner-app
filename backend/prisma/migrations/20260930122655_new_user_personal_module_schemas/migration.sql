-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('UNSPECIFIED', 'COMPLETED', 'ONGOING', 'NOT_STARTED');

-- CreateEnum
CREATE TYPE "UserTrailStatus" AS ENUM ('UNSPECIFIED', 'COMPLETED', 'ONGOING', 'NOT_STARTED');

-- CreateEnum
CREATE TYPE "OwnershipStatus" AS ENUM ('UNSPECIFIED', 'OWNED', 'AWAITING_DELIVERY', 'WANT_TO_OWN');

-- CreateEnum
CREATE TYPE "LifecycleStatus" AS ENUM ('UNSPECIFIED', 'AVAILABLE', 'TEMP_UNAVAILABLE', 'RETIRED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "TargetTypeAll" AS ENUM ('GEAR', 'TRAIL', 'TRIP');

-- CreateEnum
CREATE TYPE "TargetTypeSelected" AS ENUM ('GEAR', 'TRAIL', 'TRIP');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('UNSPECIFIED', 'OPEN', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('UNSPECIFIED', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "InspirationType" AS ENUM ('UNSPECIFIED', 'GENERAL', 'TRAIL', 'GEAR');

-- CreateEnum
CREATE TYPE "ArchiveType" AS ENUM ('FILE', 'MEDIA', 'URL', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('UNSPECIFIED', 'ALLTRAILS', 'OFFICIAL_WEBSITE');

-- CreateEnum
CREATE TYPE "ProposedAction" AS ENUM ('MERGE', 'CANONICALIZE', 'REQUEST_REVIEW', 'PUBLISH_NEW', 'UPDATE');

-- CreateTable
CREATE TABLE "UserTrail" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "positive_attitude" BOOLEAN,
    "completion_status" "UserTrailStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserTrail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrailCompletion" (
    "id" SERIAL NOT NULL,
    "user_trail_id" INTEGER NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserTrailCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGear" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "gear_id" INTEGER NOT NULL,
    "positive_attitude" BOOLEAN,
    "ownership_status" "OwnershipStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "lifecycle_status" "LifecycleStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "nickname" TEXT,
    "purchased_date" DATE NOT NULL,
    "retired_date" DATE NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserGear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGearPack" (
    "id" SERIAL NOT NULL,
    "gear_pack_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'default',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserGearPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGearPackItem" (
    "id" SERIAL NOT NULL,
    "user_gear_pack_id" INTEGER NOT NULL,
    "gear_pack_component_id" INTEGER,
    "user_gear_id" INTEGER,
    "gear_description" TEXT,
    "alt_frequency" "Frequency",
    "alt_qty" INTEGER,
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserGearPackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPersonalArchive" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "archive_type" "ArchiveType" NOT NULL,
    "archive_ref" TEXT NOT NULL,
    "source_type" "SourceType" NOT NULL,
    "target_type" "TargetType",
    "target_id" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserPersonalArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReminder" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "reminder_status" "ReminderStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "priority" "Priority" NOT NULL DEFAULT 'UNSPECIFIED',
    "due_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "target_type" "TargetTypeSelected" NOT NULL,
    "target_id" INTEGER,
    "critical_event_id" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeedback" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_type" "TargetTypeSelected" NOT NULL,
    "target_id" INTEGER,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "feedback_status" "RecordOperationStatus",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "last_reviewed_at" TIMESTAMP(3),
    "last_reviewed_by" INTEGER,

    CONSTRAINT "UserFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_type" "TargetTypeSelected" NOT NULL,
    "target_id" INTEGER,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "pinned" BOOLEAN,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInspiration" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "inspiration_type" "InspirationType" NOT NULL DEFAULT 'UNSPECIFIED',
    "target_type" "TargetTypeSelected" NOT NULL,
    "target_id" INTEGER,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserInspiration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProposal" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "target_type" "TargetTypeSelected" NOT NULL,
    "target_id" INTEGER,
    "proposed_action" "ProposedAction" NOT NULL,
    "proposal_support_url" TEXT,
    "proposal_status" "RecordOperationStatus" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "last_reviewed_at" TIMESTAMP(3),
    "last_reviewed_by" INTEGER,

    CONSTRAINT "UserProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "trip_status" "TripStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTrailCompletion_user_trail_id_completed_at_key" ON "UserTrailCompletion"("user_trail_id", "completed_at");
