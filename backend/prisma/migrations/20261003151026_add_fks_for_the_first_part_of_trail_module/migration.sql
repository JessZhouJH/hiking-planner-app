-- AlterTable
ALTER TABLE "ChallengeGearRequirement" ADD COLUMN     "gear_requirement_description" TEXT;

-- AlterTable
ALTER TABLE "TrailProfile" ADD COLUMN     "trail_source_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ChallengeGearRequirement" ADD CONSTRAINT "ChallengeGearRequirement_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeGearRequirement" ADD CONSTRAINT "ChallengeGearRequirement_gear_type_id_fkey" FOREIGN KEY ("gear_type_id") REFERENCES "GearType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeGearRequirement" ADD CONSTRAINT "ChallengeGearRequirement_gear_specs_definition_id_fkey" FOREIGN KEY ("gear_specs_definition_id") REFERENCES "GearSpecsDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DifficultyMapping" ADD CONSTRAINT "DifficultyMapping_difficulty_system_id_fkey" FOREIGN KEY ("difficulty_system_id") REFERENCES "DifficultySystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trail" ADD CONSTRAINT "Trail_primary_profile_id_fkey" FOREIGN KEY ("primary_profile_id") REFERENCES "TrailProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trail" ADD CONSTRAINT "Trail_preview_img_media_id_fkey" FOREIGN KEY ("preview_img_media_id") REFERENCES "MediaArchive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trail" ADD CONSTRAINT "Trail_derived_from_trail_id_fkey" FOREIGN KEY ("derived_from_trail_id") REFERENCES "Trail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailChallenge" ADD CONSTRAINT "TrailChallenge_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailChallenge" ADD CONSTRAINT "TrailChallenge_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailCalendar" ADD CONSTRAINT "TrailCalendar_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSource" ADD CONSTRAINT "TrailSource_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailSource" ADD CONSTRAINT "TrailSource_difficulty_system_id_fkey" FOREIGN KEY ("difficulty_system_id") REFERENCES "DifficultySystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGearRequirement" ADD CONSTRAINT "TrailGearRequirement_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGearRequirement" ADD CONSTRAINT "TrailGearRequirement_gear_type_id_fkey" FOREIGN KEY ("gear_type_id") REFERENCES "GearType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGearRequirement" ADD CONSTRAINT "TrailGearRequirement_gear_specs_definition_id_fkey" FOREIGN KEY ("gear_specs_definition_id") REFERENCES "GearSpecsDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailGearRequirement" ADD CONSTRAINT "TrailGearRequirement_trail_source_id_fkey" FOREIGN KEY ("trail_source_id") REFERENCES "TrailSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailDifficulty" ADD CONSTRAINT "TrailDifficulty_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailDifficulty" ADD CONSTRAINT "TrailDifficulty_trail_source_id_fkey" FOREIGN KEY ("trail_source_id") REFERENCES "TrailSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailFacility" ADD CONSTRAINT "TrailFacility_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailFacility" ADD CONSTRAINT "TrailFacility_trail_source_id_fkey" FOREIGN KEY ("trail_source_id") REFERENCES "TrailSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailProfile" ADD CONSTRAINT "TrailProfile_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailProfile" ADD CONSTRAINT "TrailProfile_trail_source_id_fkey" FOREIGN KEY ("trail_source_id") REFERENCES "TrailSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailProfile" ADD CONSTRAINT "TrailProfile_primary_geometry_id_fkey" FOREIGN KEY ("primary_geometry_id") REFERENCES "TrailGeometry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailProfileUse" ADD CONSTRAINT "TrailProfileUse_trail_profile_id_fkey" FOREIGN KEY ("trail_profile_id") REFERENCES "TrailProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailProfileUse" ADD CONSTRAINT "TrailProfileUse_trail_use_id_fkey" FOREIGN KEY ("trail_use_id") REFERENCES "TrailUse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
