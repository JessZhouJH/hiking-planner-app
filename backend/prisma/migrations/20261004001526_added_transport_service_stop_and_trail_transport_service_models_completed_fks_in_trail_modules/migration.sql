/*
  Warnings:

  - You are about to drop the column `facility_id` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `access_pointfeasibility` on the `AccessPointCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `access_pointid` on the `TrailAccessPointRelation` table. All the data in the column will be lost.
  - You are about to drop the column `access_pointrole` on the `TrailAccessPointRelation` table. All the data in the column will be lost.
  - You are about to drop the column `gpx_src_url` on the `TrailGeometry` table. All the data in the column will be lost.
  - You are about to drop the column `child_start_access_pointid` on the `TrailSegmentRelation` table. All the data in the column will be lost.
  - You are about to drop the column `end_access_pointid` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `end_access_pointname` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `start_access_pointid` on the `TransportService` table. All the data in the column will be lost.
  - You are about to drop the column `start_access_pointname` on the `TransportService` table. All the data in the column will be lost.
  - Added the required column `access_point_id` to the `TrailAccessPointRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessPoint" DROP COLUMN "facility_id";

-- AlterTable
ALTER TABLE "AccessPointCalendar" DROP COLUMN "access_pointfeasibility",
ADD COLUMN     "access_point_feasibility" "FeasibilityTag" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "TrailAccessPointRelation" DROP COLUMN "access_pointid",
DROP COLUMN "access_pointrole",
ADD COLUMN     "access_point_id" INTEGER NOT NULL,
ADD COLUMN     "access_point_role" "AccessPointRole" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "TrailFacility" ADD COLUMN     "access_point_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailGeometry" DROP COLUMN "gpx_src_url",
ADD COLUMN     "gpx_source_url" TEXT;

-- AlterTable
ALTER TABLE "TrailSegmentRelation" DROP COLUMN "child_start_access_pointid",
ADD COLUMN     "child_start_access_point_id" INTEGER;

-- AlterTable
ALTER TABLE "TrailSegmentation" ADD COLUMN     "trail_geometry_id" INTEGER,
ADD COLUMN     "trail_profile_id" INTEGER;

-- AlterTable
ALTER TABLE "TransportService" DROP COLUMN "end_access_pointid",
DROP COLUMN "end_access_pointname",
DROP COLUMN "start_access_pointid",
DROP COLUMN "start_access_pointname",
ADD COLUMN     "end_access_point_id" INTEGER,
ADD COLUMN     "end_access_point_name" TEXT,
ADD COLUMN     "reverse_direction_service_id" INTEGER,
ADD COLUMN     "start_access_point_id" INTEGER,
ADD COLUMN     "start_access_point_name" TEXT,
ADD COLUMN     "supports_reverse_direction" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TransportServiceStop" (
    "id" SERIAL NOT NULL,
    "transport_service_id" INTEGER NOT NULL,
    "stop_name" TEXT,
    "stop_access_point_id" INTEGER,
    "stop_sequence" INTEGER,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "TransportServiceStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailTransportService" (
    "id" SERIAL NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "transport_service_id" INTEGER NOT NULL,
    "transfer_type" "TransferType" NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "last_verified_at" TIMESTAMP(3),
    "last_verified_by_id" INTEGER,

    CONSTRAINT "TrailTransportService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrailFacility" ADD CONSTRAINT "TrailFacility_access_point_id_fkey" FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD CONSTRAINT "AccessPoint_merged_by_id_fkey" FOREIGN KEY ("merged_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD CONSTRAINT "AccessPoint_canonical_proposed_by_id_fkey" FOREIGN KEY ("canonical_proposed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD CONSTRAINT "AccessPoint_canonical_proposal_consent_by_id_fkey" FOREIGN KEY ("canonical_proposal_consent_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD CONSTRAINT "AccessPoint_canonical_proposal_resolved_by_id_fkey" FOREIGN KEY ("canonical_proposal_resolved_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD CONSTRAINT "AccessPoint_merged_into_id_fkey" FOREIGN KEY ("merged_into_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPointCalendar" ADD CONSTRAINT "AccessPointCalendar_access_point_id_fkey" FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailAccessPointRelation" ADD CONSTRAINT "TrailAccessPointRelation_access_point_id_fkey" FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailAccessPointRelation" ADD CONSTRAINT "TrailAccessPointRelation_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGeometry" ADD CONSTRAINT "TrailGeometry_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGeometry" ADD CONSTRAINT "TrailGeometry_start_access_point_id_fkey" FOREIGN KEY ("start_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGeometry" ADD CONSTRAINT "TrailGeometry_end_access_point_id_fkey" FOREIGN KEY ("end_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGeometry" ADD CONSTRAINT "TrailGeometry_derived_from_id_fkey" FOREIGN KEY ("derived_from_id") REFERENCES "TrailGeometry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSegmentation" ADD CONSTRAINT "TrailSegmentation_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSegmentation" ADD CONSTRAINT "TrailSegmentation_trail_profile_id_fkey" FOREIGN KEY ("trail_profile_id") REFERENCES "TrailProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSegmentation" ADD CONSTRAINT "TrailSegmentation_trail_geometry_id_fkey" FOREIGN KEY ("trail_geometry_id") REFERENCES "TrailGeometry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSegmentation" ADD CONSTRAINT "TrailSegmentation_derived_from_segmentation_id_fkey" FOREIGN KEY ("derived_from_segmentation_id") REFERENCES "TrailSegmentation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSegmentRelation" ADD CONSTRAINT "TrailSegmentRelation_trail_segmentation_id_fkey" FOREIGN KEY ("trail_segmentation_id") REFERENCES "TrailSegmentation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSegmentRelation" ADD CONSTRAINT "TrailSegmentRelation_child_trail_id_fkey" FOREIGN KEY ("child_trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSegmentRelation" ADD CONSTRAINT "TrailSegmentRelation_child_start_access_point_id_fkey" FOREIGN KEY ("child_start_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportService" ADD CONSTRAINT "TransportService_start_access_point_id_fkey" FOREIGN KEY ("start_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportService" ADD CONSTRAINT "TransportService_end_access_point_id_fkey" FOREIGN KEY ("end_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportService" ADD CONSTRAINT "TransportService_reverse_direction_service_id_fkey" FOREIGN KEY ("reverse_direction_service_id") REFERENCES "TransportService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportServiceCalendar" ADD CONSTRAINT "TransportServiceCalendar_transport_service_id_fkey" FOREIGN KEY ("transport_service_id") REFERENCES "TransportService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportServiceStop" ADD CONSTRAINT "TransportServiceStop_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportServiceStop" ADD CONSTRAINT "TransportServiceStop_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportServiceStop" ADD CONSTRAINT "TransportServiceStop_transport_service_id_fkey" FOREIGN KEY ("transport_service_id") REFERENCES "TransportService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportServiceStop" ADD CONSTRAINT "TransportServiceStop_stop_access_point_id_fkey" FOREIGN KEY ("stop_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailTransportService" ADD CONSTRAINT "TrailTransportService_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailTransportService" ADD CONSTRAINT "TrailTransportService_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailTransportService" ADD CONSTRAINT "TrailTransportService_last_verified_by_id_fkey" FOREIGN KEY ("last_verified_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailTransportService" ADD CONSTRAINT "TrailTransportService_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailTransportService" ADD CONSTRAINT "TrailTransportService_transport_service_id_fkey" FOREIGN KEY ("transport_service_id") REFERENCES "TransportService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
