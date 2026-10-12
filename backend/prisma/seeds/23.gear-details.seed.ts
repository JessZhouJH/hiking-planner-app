import { prisma } from "./seed-client"

import { upsertGearData } from "../../src/services/gear/gear.service"
import { findGearTypeByName } from '../../src/services/gear/gear_type.service'
import { findBrandByName } from '../../src/services/gear/brand.service'
import { upsertDescriptiveGearData } from '../../src/services/gear/descriptive_gear.service'
import { upsertGearVariantData } from '../../src/services/gear/gear_variant.service'
import { findTagByName } from "../../src/services/common/tag.service"
import { upsertGearSpecsData } from '../../src/services/gear/gear_specs.service'
import { upsertGearTagRelationData } from '../../src/services/gear/gear_tag_relation.service'
import { SYSTEM_USER_ID } from "../../src/constants/macros"
import { findGearSpecsDefinitionByNameAndType } from "../../src/services/gear/gear_specs_definition.service"
import { findUnitByName } from '../../src/services/common/unit.service'

export async function seedGearDetails() {
    
    const backpack_type = await findGearTypeByName("Backpack")
    if (!backpack_type) {throw new Error("GearType Backpack Bag not found")}
    const sleeping_bag_type = await findGearTypeByName("Sleeping Bag")
    if (!sleeping_bag_type) {throw new Error("GearType Sleeping Bag not found")}
    const sleeping_bag_liner_type = await findGearTypeByName("Sleeping Bag Liner")
    if (!sleeping_bag_liner_type) {throw new Error("GearType Sleeping Bag Liner not found")}
    const pillow_type = await findGearTypeByName("Pillow")
    if (!pillow_type) {throw new Error("GearType Pillow not found")}
    const tent_type = await findGearTypeByName("Tent")
    if (!tent_type) {throw new Error("GearType Tent not found")}
    const sleeping_mat_type = await findGearTypeByName("Sleeping Mat")
    if (!sleeping_mat_type) {throw new Error("GearType Sleeping Mat not found")}
    const sleeping_pad_type = await findGearTypeByName("Sleeping Pad")
    if (!sleeping_pad_type) {throw new Error("GearType Sleeping Pad not found")}
    const trekking_pack_type = await findGearTypeByName("Trekking Pack")
    if (!trekking_pack_type) {throw new Error("GearType Trekking Pack not found")}
    const foldable_pack_type = await findGearTypeByName("Foldable Pack")
    if (!foldable_pack_type) {throw new Error("GearType Foldable Pack not found")}
    const day_pack_type = await findGearTypeByName("Daypack")
    if (!day_pack_type) {throw new Error("GearType Daypack not found")}
    const hiking_boots_type = await findGearTypeByName("Hiking Boots")
    if (!hiking_boots_type) {throw new Error("GearType Hiking Boots not found")}

    const osprey_brand = await findBrandByName("Osprey")
    const sea_to_summit_brand = await findBrandByName("Sea To Summit")
    const gregory_brand = await findBrandByName("Gregory")
    const naturehike_brand = await findBrandByName("Naturehike")
    const thermarest_brand = await findBrandByName("Therm-A-Rest")

    // gear
    const osprey_hikelite_26 = await upsertGearData(
        "Hikelite 26 Backpack",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        day_pack_type.id,
        osprey_brand?.id
    )
    const gregory_maven_48 = await upsertGearData(
        "Maven 48",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        trekking_pack_type.id,
        gregory_brand?.id
    )
    const gregory_deva_60 = await upsertGearData(
        "Deva 60",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        trekking_pack_type.id,
        gregory_brand?.id
    )
    const naturehike_starriver_tent = await upsertGearData(
        "Star River 2-Person Ultralight Backpacking Tent",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        tent_type.id,
        naturehike_brand?.id
    )
    const sts_XR_sleeping_mat = await upsertGearData(
        "XR Insulated Air Sleeping Mat",
        SYSTEM_USER_ID, 
        SYSTEM_USER_ID,
        sleeping_mat_type.id,
        sea_to_summit_brand?.id
    )
    const thermarest_sleeping_pad = await upsertGearData(
        "NeoAir XTherm NXT Sleeping Pd",
        SYSTEM_USER_ID, 
        SYSTEM_USER_ID,
        sleeping_pad_type.id,
        thermarest_brand?.id
    )
    const sts_ascent_sleeping_bag = await upsertGearData(
        "Ascent Down Sleeping Bag -1",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        sleeping_bag_type.id,
        sea_to_summit_brand?.id
    )
    const sts_reactor_liner = await upsertGearData(
        "Reactor Sleeping Bag Liner",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        sleeping_bag_liner_type.id,
        sea_to_summit_brand?.id
    )
    const sts_areo_pillow = await upsertGearData(
        "Areo Premium Pillow",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        pillow_type.id,
        sea_to_summit_brand?.id
    )

    // descriptive gear
    const first_aid_kit = await upsertDescriptiveGearData(
        "First Aid Kit",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID
    )
    const whistle = await upsertDescriptiveGearData(
        "Whistle",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID
    )

    // gear specs
    const kilogram_unit = await findUnitByName('Kilogram')
    const gram_unit = await findUnitByName('Gram')
    const celsius_unit = await findUnitByName('Celsius')
    const kilometer_unit = await findUnitByName('Kilometer')
    const meter_unit = await findUnitByName('Meter')
    const centimeter_unit = await findUnitByName('Centimeter')
    const millimeter_unit = await findUnitByName('Millimeter')
    const liter_unit = await findUnitByName('Liter')
    const milliliter_unit = await findUnitByName('Milliliter')
    const squaremeter_unit = await findUnitByName('Square Meter')
    const lumen_unit = await findUnitByName('Lumen')
    const hour_unit = await findUnitByName('Hour')
    // Maven 48
    const backpack_weight_spec_definition = findGearSpecsDefinitionByNameAndType("Weight", backpack_type.id)
    if (!backpack_weight_spec_definition) {throw new Error("GearSpecsDefinition Weight-backpack_type not found")}
    const backpack_capacity_spec_definition = findGearSpecsDefinitionByNameAndType("Capacity", backpack_type.id)
    if (!backpack_capacity_spec_definition) {throw new Error("GearSpecsDefinition Capacity-backpack_type not found")}
    const backpack_recommended_load_spec_definition = findGearSpecsDefinitionByNameAndType("Recommended Load", backpack_type.id)
    if (!backpack_recommended_load_spec_definition) {throw new Error("GearSpecsDefinition Recommended Load-backpack_type not found")}
    const backpack_torso_length_spec_definition = findGearSpecsDefinitionByNameAndType("Torso Length", backpack_type.id)
    if (!backpack_torso_length_spec_definition) {throw new Error("GearSpecsDefinition Torso Length-backpack_type not found")}
    


    // gear feature


    // gear variant
    await upsertGearVariantData(
        sts_ascent_sleeping_bag.id,
        "Regular",
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        sts_areo_pillow.id,
        "Regular",
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        sts_ascent_sleeping_bag.id,
        "Large",
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        sts_ascent_sleeping_bag.id,
        "XLarge",
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        gregory_deva_60.id,
        "xs",
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        gregory_deva_60.id,
        "sm",
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        gregory_deva_60.id,
        "md",
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        gregory_deva_60.id,
        "Mountain Teal",
        SYSTEM_USER_ID
    )
    await upsertGearVariantData(
        gregory_deva_60.id,
        "Garnet Red",
        SYSTEM_USER_ID
    )

    // gear tag relation
    const waterproof_tag = await findTagByName("Waterproof")
    if (!waterproof_tag) {throw new Error("Tag Waterproof not found")}
    const sleeping_system_tag = await findTagByName("Sleeping System")
    if (!sleeping_system_tag) {throw new Error("Tag Sleeping System not found")}
    const ultralight_tag = await findTagByName("Ultralight")
    if (!ultralight_tag) {throw new Error("Tag Ultralight not found")}
    const multiday_tag = await findTagByName("Multiday")
    if (!multiday_tag) {throw new Error("Tag Multiday not found")}

    await upsertGearTagRelationData(naturehike_starriver_tent.id, waterproof_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(naturehike_starriver_tent.id, sleeping_system_tag.id, SYSTEM_USER_ID)    

    await upsertGearTagRelationData(sts_XR_sleeping_mat.id, sleeping_system_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(thermarest_sleeping_pad.id, sleeping_system_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(sts_ascent_sleeping_bag.id, sleeping_system_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(sts_reactor_liner.id, sleeping_system_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(sts_areo_pillow.id, sleeping_system_tag.id, SYSTEM_USER_ID)    

    await upsertGearTagRelationData(sts_XR_sleeping_mat.id, ultralight_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(sts_ascent_sleeping_bag.id, ultralight_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(sts_reactor_liner.id, ultralight_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(thermarest_sleeping_pad.id, ultralight_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(sts_areo_pillow.id, ultralight_tag.id, SYSTEM_USER_ID)    

    await upsertGearTagRelationData(gregory_maven_48.id, multiday_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(gregory_deva_60.id, multiday_tag.id, SYSTEM_USER_ID)    
    await upsertGearTagRelationData(sts_ascent_sleeping_bag.id, multiday_tag.id, SYSTEM_USER_ID)    

}