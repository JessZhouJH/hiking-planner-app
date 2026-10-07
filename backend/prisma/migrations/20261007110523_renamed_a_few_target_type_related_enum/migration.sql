/*
  Warnings:

  - The `action_result_object_type` column on the `RecordAction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `target_object_type` on the `Alias` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_object_type` on the `Attachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_object_type` on the `CollectionItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_object_type` on the `CommunityPublication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_object_type` on the `CommunityPublicationItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_type` on the `ContentReviewHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_type` on the `RecordAction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_object_type` on the `UserFeedback` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_object_type` on the `UserPersonalArchive` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_object_type` on the `UserProposal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_object_type` on the `UserStickyNotes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AllTargetType" AS ENUM ('GEAR', 'TRAIL', 'TRIP', 'BRAND');

-- CreateEnum
CREATE TYPE "AliasTargetType" AS ENUM ('GEAR', 'TRAIL', 'BRAND', 'ACCESS_POINT', 'DESCRIPTIVE_GEAR');

-- CreateEnum
CREATE TYPE "SelectedTargetType" AS ENUM ('GEAR', 'TRAIL', 'TRIP');

-- AlterTable
ALTER TABLE "Alias" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "AliasTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "AllTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "CollectionItem" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "SelectedTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "CommunityPublication" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "SelectedTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "CommunityPublicationItem" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "SelectedTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "ContentReviewHistory" DROP COLUMN "target_type",
ADD COLUMN     "target_type" "AllTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "RecordAction" DROP COLUMN "target_type",
ADD COLUMN     "target_type" "AllTargetType" NOT NULL,
DROP COLUMN "action_result_object_type",
ADD COLUMN     "action_result_object_type" "AllTargetType";

-- AlterTable
ALTER TABLE "UserFeedback" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "SelectedTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "UserPersonalArchive" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "AllTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "UserProposal" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "SelectedTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "UserStickyNotes" DROP COLUMN "target_object_type",
ADD COLUMN     "target_object_type" "SelectedTargetType" NOT NULL;

-- DropEnum
DROP TYPE "TargetTypeAll";

-- DropEnum
DROP TYPE "TargetTypeSelected";

-- CreateIndex
CREATE UNIQUE INDEX "Alias_target_object_type_target_object_id_alias_key" ON "Alias"("target_object_type", "target_object_id", "alias");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_target_object_type_target_object_id_attachment_u_key" ON "Attachment"("target_object_type", "target_object_id", "attachment_usage", "media_archive_id");
