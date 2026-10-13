/*
  Warnings:

  - You are about to drop the `temporary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_updated_by_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_by_id" DROP NOT NULL,
ALTER COLUMN "updated_by_id" DROP NOT NULL;

-- DropTable
DROP TABLE "temporary";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
