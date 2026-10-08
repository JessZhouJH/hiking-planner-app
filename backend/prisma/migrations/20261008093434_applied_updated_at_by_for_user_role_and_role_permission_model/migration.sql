/*
  Warnings:

  - Added the required column `updated_at` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GeometryExportPolicy" AS ENUM ('UNSPECIFIED', 'OWNER_ONLY', 'ALLOWED', 'RESTRICTED', 'FORBIDDEN');

-- AlterTable
ALTER TABLE "RolePermission" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TrailGeometry" ADD COLUMN     "export_policy" "GeometryExportPolicy" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
