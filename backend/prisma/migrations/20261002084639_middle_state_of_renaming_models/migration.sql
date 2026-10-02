/*
  Warnings:

  - You are about to drop the column `content` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_id` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `inspiration_type` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `target_object_id` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `target_object_type` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserInspiration` table. All the data in the column will be lost.
  - You are about to drop the `UserNotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "UserInspiration" DROP COLUMN "content",
DROP COLUMN "created_at",
DROP COLUMN "created_by_id",
DROP COLUMN "inspiration_type",
DROP COLUMN "status",
DROP COLUMN "target_object_id",
DROP COLUMN "target_object_type",
DROP COLUMN "title",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by_id",
DROP COLUMN "user_id";

-- DropTable
DROP TABLE "UserNotes";

-- CreateTable
CREATE TABLE "UserIdeaCapture" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "UserIdeaCapture_pkey" PRIMARY KEY ("id")
);
