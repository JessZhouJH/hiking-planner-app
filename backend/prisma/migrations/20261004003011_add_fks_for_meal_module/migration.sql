-- AddForeignKey
ALTER TABLE "MealPack" ADD CONSTRAINT "MealPack_derived_from_meal_pack_id_fkey" FOREIGN KEY ("derived_from_meal_pack_id") REFERENCES "MealPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPackItem" ADD CONSTRAINT "MealPackItem_meal_pack_id_fkey" FOREIGN KEY ("meal_pack_id") REFERENCES "MealPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPackItem" ADD CONSTRAINT "MealPackItem_meal_item_id_fkey" FOREIGN KEY ("meal_item_id") REFERENCES "MealItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
