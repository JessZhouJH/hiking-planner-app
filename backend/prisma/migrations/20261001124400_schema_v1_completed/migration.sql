/*
  Warnings:

  - The values [UNSPEFICIED,CACULATED] on the enum `DataOrigin` will be removed. If these variants are still used in the database, this will fail.
  - The `canonical_proposal_status` column on the `AccessPoint` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `merge_status` column on the `AccessPoint` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `target_id` on the `Alias` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `Alias` table. All the data in the column will be lost.
  - You are about to drop the column `attach_to_id` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `attach_to_type` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `attachment_type` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `media_id` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded_at` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded_by_id` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `media_id` on the `TrailFacility` table. All the data in the column will be lost.
  - You are about to drop the column `source_media_id` on the `TrailSource` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `UserFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `UserFeedback` table. All the data in the column will be lost.
  - The `feedback_status` column on the `UserFeedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `target_id` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `UserNotes` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `UserNotes` table. All the data in the column will be lost.
  - You are about to drop the column `archive_ref` on the `UserPersonalArchive` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `UserPersonalArchive` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `UserPersonalArchive` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `UserProposal` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `UserProposal` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `UserReminder` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `UserReminder` table. All the data in the column will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[target_object_type,target_object_id,alias]` on the table `Alias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[target_object_type,target_object_id,attachment_usage,media_archive_id]` on the table `Attachment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[archive_key]` on the table `UserPersonalArchive` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `target_object_id` to the `Alias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_object_type` to the `Alias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attachment_usage` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `media_archive_id` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_object_id` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_object_type` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_object_type` to the `UserFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_object_type` to the `UserInspiration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_object_type` to the `UserNotes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `archive_key` to the `UserPersonalArchive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_object_type` to the `UserProposal` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `proposal_status` on the `UserProposal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `target_object_type` to the `UserReminder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttachmentUsage" AS ENUM ('EVIDENCE', 'SOURCE_DOCUMENT', 'SUPPORTING_MATERIAL', 'RECEIPT', 'BOOKING_CONFIRMATION', 'FEEDBACK', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaArchiveType" AS ENUM ('UNSPECIFIED', 'FILE', 'IMAGE', 'AUDIO', 'VIDEO', 'GPX', 'MAP', 'OTHER');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('UNSPECIFIED', 'GEAR', 'TRAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "UserProposalStatus" AS ENUM ('UNSPECIFIED', 'PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN', 'SUPPORTING_MATERIAL_REQUESTED', 'READY_FOR_REVIEW');

-- AlterEnum
BEGIN;
CREATE TYPE "DataOrigin_new" AS ENUM ('UNSPECIFIED', 'MANUAL', 'IMPORTED', 'CALCULATED', 'DERIVED', 'PUBLISHED_FROM_COMMUNITY');
-- ALTER TABLE "MediaArchive" ALTER COLUMN "source_origin" TYPE "DataOrigin_new" USING ("source_origin"::text::"DataOrigin_new");
ALTER TABLE "Trail" ALTER COLUMN "trail_origin" TYPE "DataOrigin_new" USING ("trail_origin"::text::"DataOrigin_new");
ALTER TABLE "TrailProfile" ALTER COLUMN "profile_origin" TYPE "DataOrigin_new" USING ("profile_origin"::text::"DataOrigin_new");
ALTER TABLE "TrailGeometry" ALTER COLUMN "geometry_origin" TYPE "DataOrigin_new" USING ("geometry_origin"::text::"DataOrigin_new");
ALTER TYPE "DataOrigin" RENAME TO "DataOrigin_old";
ALTER TYPE "DataOrigin_new" RENAME TO "DataOrigin";
DROP TYPE "public"."DataOrigin_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SourceType" ADD VALUE 'WEB_ARTICLE';
ALTER TYPE "SourceType" ADD VALUE 'BOOK';
ALTER TYPE "SourceType" ADD VALUE 'YOUTUBE';

-- DropIndex
DROP INDEX "Alias_target_type_target_id_alias_key";

-- AlterTable
ALTER TABLE "AccessPoint" DROP COLUMN "canonical_proposal_status",
ADD COLUMN     "canonical_proposal_status" "UserProposalStatus",
DROP COLUMN "merge_status",
ADD COLUMN     "merge_status" "UserProposalStatus";

-- AlterTable
ALTER TABLE "Alias" DROP COLUMN "target_id",
DROP COLUMN "target_type",
ADD COLUMN     "target_object_id" INTEGER NOT NULL,
ADD COLUMN     "target_object_type" "TargetType" NOT NULL;

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "attach_to_id",
DROP COLUMN "attach_to_type",
DROP COLUMN "attachment_type",
DROP COLUMN "media_id",
DROP COLUMN "uploaded_at",
DROP COLUMN "uploaded_by_id",
ADD COLUMN     "attachment_usage" "AttachmentUsage" NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" INTEGER NOT NULL,
ADD COLUMN     "media_archive_id" INTEGER NOT NULL,
ADD COLUMN     "target_object_id" INTEGER NOT NULL,
ADD COLUMN     "target_object_type" "TargetType" NOT NULL;

-- AlterTable
ALTER TABLE "TrailFacility" DROP COLUMN "media_id";

-- AlterTable
ALTER TABLE "TrailSource" DROP COLUMN "source_media_id";

-- AlterTable
ALTER TABLE "UserFeedback" DROP COLUMN "target_id",
DROP COLUMN "target_type",
ADD COLUMN     "target_object_id" INTEGER,
ADD COLUMN     "target_object_type" "TargetTypeSelected" NOT NULL,
DROP COLUMN "feedback_status",
ADD COLUMN     "feedback_status" "UserProposalStatus";

-- AlterTable
ALTER TABLE "UserInspiration" DROP COLUMN "target_id",
DROP COLUMN "target_type",
ADD COLUMN     "target_object_id" INTEGER,
ADD COLUMN     "target_object_type" "TargetTypeSelected" NOT NULL;

-- AlterTable
ALTER TABLE "UserNotes" DROP COLUMN "target_id",
DROP COLUMN "target_type",
ADD COLUMN     "target_object_id" INTEGER,
ADD COLUMN     "target_object_type" "TargetTypeSelected" NOT NULL;

-- AlterTable
ALTER TABLE "UserPersonalArchive" DROP COLUMN "archive_ref",
DROP COLUMN "target_id",
DROP COLUMN "target_type",
ADD COLUMN     "archive_key" TEXT NOT NULL,
ADD COLUMN     "archive_source_url" TEXT,
ADD COLUMN     "target_object_id" INTEGER,
ADD COLUMN     "target_object_type" "TargetType";

-- AlterTable
ALTER TABLE "UserProposal" DROP COLUMN "target_id",
DROP COLUMN "target_type",
ADD COLUMN     "target_object_id" INTEGER,
ADD COLUMN     "target_object_type" "TargetTypeSelected" NOT NULL,
DROP COLUMN "proposal_status",
ADD COLUMN     "proposal_status" "UserProposalStatus" NOT NULL;

-- AlterTable
ALTER TABLE "UserReminder" DROP COLUMN "target_id",
DROP COLUMN "target_type",
ADD COLUMN     "target_object_id" INTEGER,
ADD COLUMN     "target_object_type" "TargetTypeSelected" NOT NULL;

-- DropTable
DROP TABLE "Media";

-- DropEnum
DROP TYPE "AttachmentType";

-- DropEnum
DROP TYPE "RecordOperationStatus";

-- CreateTable
CREATE TABLE "MediaArchive" (
    "id" SERIAL NOT NULL,
    "media_archive_key" TEXT NOT NULL,
    "media_archive_type" "MediaArchiveType" NOT NULL,
    "source_type" "SourceType" NOT NULL,
    "source_origin" "DataOrigin" NOT NULL,
    "source_url" TEXT,
    "contributor_id" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "MediaArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "collection_type" "CollectionType" NOT NULL DEFAULT 'UNSPECIFIED',
    "collection_summary" TEXT,
    "owner_id" INTEGER,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" SERIAL NOT NULL,
    "collection_id" INTEGER NOT NULL,
    "target_object_type" "TargetTypeSelected" NOT NULL,
    "target_object_id" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPublication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contributor_id" INTEGER NOT NULL,
    "target_object_type" "TargetTypeSelected" NOT NULL,
    "target_root_id" INTEGER,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_by_id" INTEGER NOT NULL,
    "last_reviewed_at" TIMESTAMP(3),
    "last_reviewed_by_id" INTEGER,
    "submission_status" "UserProposalStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "applicant_notes" TEXT,
    "reviewer_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "CommunityPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPublicationItem" (
    "id" SERIAL NOT NULL,
    "community_publication_id" INTEGER NOT NULL,
    "contributor_id" INTEGER NOT NULL,
    "target_object_type" "TargetTypeSelected" NOT NULL,
    "target_object_id" INTEGER NOT NULL,
    "snapshot_object_id" INTEGER,
    "published_object_id" INTEGER,
    "item_status" "UserProposalStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "authenticity_level" "AuthenticityLevel" NOT NULL DEFAULT 'UNSPECIFIED',
    "applicant_notes" TEXT,
    "reviewer_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "last_reviewed_at" TIMESTAMP(3),
    "last_reviewed_by_id" INTEGER,

    CONSTRAINT "CommunityPublicationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPublicationAttachment" (
    "id" SERIAL NOT NULL,
    "personal_archive_id" INTEGER NOT NULL,
    "attachment_usage" "AttachmentUsage" NOT NULL,
    "community_publication_id" INTEGER,
    "community_publication_item_id" INTEGER,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "CommunityPublicationAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaArchive_media_archive_key_key" ON "MediaArchive"("media_archive_key");

-- CreateIndex
CREATE UNIQUE INDEX "Alias_target_object_type_target_object_id_alias_key" ON "Alias"("target_object_type", "target_object_id", "alias");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_target_object_type_target_object_id_attachment_u_key" ON "Attachment"("target_object_type", "target_object_id", "attachment_usage", "media_archive_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPersonalArchive_archive_key_key" ON "UserPersonalArchive"("archive_key");
