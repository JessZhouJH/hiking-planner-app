-- CreateEnum
CREATE TYPE "ActionReason" AS ENUM ('UNSPECIFIED', 'DUPLICATE', 'TYPE', 'ABBREVIATION', 'CASE_OR_SYMBOL_VARIANT', 'COVERAGE_OVERLAP', 'REPLACED_BY_CANONICAL_RECORD', 'OTHER');

-- CreateEnum
CREATE TYPE "RecordActionStatus" AS ENUM ('UNSPECIFIED', 'PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN', 'SUPPORTING_MATERIAL_REQUESTED', 'READY_FOR_REVIEW');

-- CreateEnum
CREATE TYPE "ContentReviewType" AS ENUM ('UNSPECIFIED', 'VERIFY', 'REVIEW');

-- AlterEnum
ALTER TYPE "ProposedAction" ADD VALUE 'UNSPECIFIED';

-- DropForeignKey
ALTER TABLE "CommunityPublication" DROP CONSTRAINT "CommunityPublication_contributor_id_fkey";

-- DropForeignKey
ALTER TABLE "CommunityPublicationItem" DROP CONSTRAINT "CommunityPublicationItem_contributor_id_fkey";

-- AlterTable
ALTER TABLE "CommunityPublication" ALTER COLUMN "contributor_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CommunityPublicationItem" ALTER COLUMN "contributor_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RecordAction" (
    "id" SERIAL NOT NULL,
    "target_type" "TargetType" NOT NULL,
    "target_id" INTEGER NOT NULL,
    "parent_record_action_id" INTEGER,
    "action_type" "ProposedAction" NOT NULL DEFAULT 'UNSPECIFIED',
    "action_reason" "ActionReason" NOT NULL DEFAULT 'UNSPECIFIED',
    "action_status" "RecordActionStatus" NOT NULL DEFAULT 'UNSPECIFIED',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by_id" INTEGER NOT NULL,
    "requester_notes" TEXT,
    "consent_at" TIMESTAMP(3),
    "consent_by_id" INTEGER,
    "performed_at" TIMESTAMP(3),
    "performed_by_id" INTEGER,
    "performer_notes" TEXT,
    "action_result_object_type" "TargetType",
    "action_result_object_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "RecordAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentReviewHistory" (
    "id" SERIAL NOT NULL,
    "target_type" "TargetType" NOT NULL,
    "target_id" INTEGER NOT NULL,
    "predecessor_review_id" INTEGER,
    "linked_record_action_id" INTEGER,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by_id" INTEGER NOT NULL,
    "requester_notes" TEXT,
    "review_type" "ContentReviewType" NOT NULL DEFAULT 'UNSPECIFIED',
    "reivewed_at" TIMESTAMP(3),
    "reviewed_by_id" INTEGER,
    "reviewer_notes" TEXT,
    "reivew_status" "RecordActionStatus" NOT NULL DEFAULT 'UNSPECIFIED',

    CONSTRAINT "ContentReviewHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPublication" ADD CONSTRAINT "CommunityPublication_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPublication" ADD CONSTRAINT "CommunityPublication_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPublicationItem" ADD CONSTRAINT "CommunityPublicationItem_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPublicationItem" ADD CONSTRAINT "CommunityPublicationItem_community_publication_id_fkey" FOREIGN KEY ("community_publication_id") REFERENCES "CommunityPublication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPublicationAttachment" ADD CONSTRAINT "CommunityPublicationAttachment_personal_archive_id_fkey" FOREIGN KEY ("personal_archive_id") REFERENCES "UserPersonalArchive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPublicationAttachment" ADD CONSTRAINT "CommunityPublicationAttachment_community_publication_id_fkey" FOREIGN KEY ("community_publication_id") REFERENCES "CommunityPublication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPublicationAttachment" ADD CONSTRAINT "CommunityPublicationAttachment_community_publication_item__fkey" FOREIGN KEY ("community_publication_item_id") REFERENCES "CommunityPublicationItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordAction" ADD CONSTRAINT "RecordAction_parent_record_action_id_fkey" FOREIGN KEY ("parent_record_action_id") REFERENCES "RecordAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordAction" ADD CONSTRAINT "RecordAction_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordAction" ADD CONSTRAINT "RecordAction_consent_by_id_fkey" FOREIGN KEY ("consent_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordAction" ADD CONSTRAINT "RecordAction_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordAction" ADD CONSTRAINT "RecordAction_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReviewHistory" ADD CONSTRAINT "ContentReviewHistory_predecessor_review_id_fkey" FOREIGN KEY ("predecessor_review_id") REFERENCES "ContentReviewHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReviewHistory" ADD CONSTRAINT "ContentReviewHistory_linked_record_action_id_fkey" FOREIGN KEY ("linked_record_action_id") REFERENCES "RecordAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReviewHistory" ADD CONSTRAINT "ContentReviewHistory_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReviewHistory" ADD CONSTRAINT "ContentReviewHistory_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
