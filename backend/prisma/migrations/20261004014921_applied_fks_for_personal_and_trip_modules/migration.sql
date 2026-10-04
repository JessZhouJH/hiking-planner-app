-- AlterTable
ALTER TABLE "UserIdeaCapture" ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT;

-- AddForeignKey
ALTER TABLE "UserTrail" ADD CONSTRAINT "UserTrail_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrailCompletion" ADD CONSTRAINT "UserTrailCompletion_user_trail_id_fkey" FOREIGN KEY ("user_trail_id") REFERENCES "UserTrail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGear" ADD CONSTRAINT "UserGear_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGearPack" ADD CONSTRAINT "UserGearPack_gear_pack_id_fkey" FOREIGN KEY ("gear_pack_id") REFERENCES "GearPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGearPackItem" ADD CONSTRAINT "UserGearPackItem_gear_pack_component_id_fkey" FOREIGN KEY ("gear_pack_component_id") REFERENCES "GearPackComponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGearPackItem" ADD CONSTRAINT "UserGearPackItem_user_gear_pack_id_fkey" FOREIGN KEY ("user_gear_pack_id") REFERENCES "UserGearPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGearPackItem" ADD CONSTRAINT "UserGearPackItem_user_gear_id_fkey" FOREIGN KEY ("user_gear_id") REFERENCES "UserGear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeedback" ADD CONSTRAINT "UserFeedback_last_reviewed_by_id_fkey" FOREIGN KEY ("last_reviewed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAccommodation" ADD CONSTRAINT "TripAccommodation_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAccommodation" ADD CONSTRAINT "TripAccommodation_trip_trail_id_fkey" FOREIGN KEY ("trip_trail_id") REFERENCES "TripTrail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAccommodation" ADD CONSTRAINT "TripAccommodation_trail_facility_id_fkey" FOREIGN KEY ("trail_facility_id") REFERENCES "TrailFacility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAccommodation" ADD CONSTRAINT "TripAccommodation_access_point_id_fkey" FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripGearList" ADD CONSTRAINT "TripGearList_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripGearList" ADD CONSTRAINT "TripGearList_gear_type_id_fkey" FOREIGN KEY ("gear_type_id") REFERENCES "GearType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripGearList" ADD CONSTRAINT "TripGearList_user_gear_id_fkey" FOREIGN KEY ("user_gear_id") REFERENCES "UserGear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripMealPack" ADD CONSTRAINT "TripMealPack_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripMealPack" ADD CONSTRAINT "TripMealPack_meal_pack_id_fkey" FOREIGN KEY ("meal_pack_id") REFERENCES "MealPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripMealPackItem" ADD CONSTRAINT "TripMealPackItem_trip_meal_pack_id_fkey" FOREIGN KEY ("trip_meal_pack_id") REFERENCES "TripMealPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripMealPackItem" ADD CONSTRAINT "TripMealPackItem_meal_item_id_fkey" FOREIGN KEY ("meal_item_id") REFERENCES "MealItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTrail" ADD CONSTRAINT "TripTrail_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTrail" ADD CONSTRAINT "TripTrail_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTrail" ADD CONSTRAINT "TripTrail_trail_profile_id_fkey" FOREIGN KEY ("trail_profile_id") REFERENCES "TrailProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTrail" ADD CONSTRAINT "TripTrail_trail_geometry_id_fkey" FOREIGN KEY ("trail_geometry_id") REFERENCES "TrailGeometry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTransport" ADD CONSTRAINT "TripTransport_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTransport" ADD CONSTRAINT "TripTransport_trip_trail_id_fkey" FOREIGN KEY ("trip_trail_id") REFERENCES "TripTrail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTransport" ADD CONSTRAINT "TripTransport_transport_service_id_fkey" FOREIGN KEY ("transport_service_id") REFERENCES "TransportService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTransport" ADD CONSTRAINT "TripTransport_dep_access_point_id_fkey" FOREIGN KEY ("dep_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripTransport" ADD CONSTRAINT "TripTransport_arr_access_point_id_fkey" FOREIGN KEY ("arr_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriticalEvent" ADD CONSTRAINT "CriticalEvent_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriticalEvent" ADD CONSTRAINT "CriticalEvent_event_loc_access_point_id_fkey" FOREIGN KEY ("event_loc_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripChecklist" ADD CONSTRAINT "TripChecklist_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripChecklistItem" ADD CONSTRAINT "TripChecklistItem_trip_checklist_id_fkey" FOREIGN KEY ("trip_checklist_id") REFERENCES "TripChecklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
