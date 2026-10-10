import { prisma } from "./seed-client"

import { upsertGearData } from "../../src/services/gear/gear.service"
import { findGearTypeByName } from '../../src/services/gear/gear_type.service'
import { findBrandByName } from '../../src/services/gear/brand.service'
import { upsertDescriptiveGearData } from '../../src/services/gear/descriptive_gear.service'
import { upsertGearVariantData } from '../../src/services/gear/gear_variant.service'

import { SYSTEM_USER_ID } from "../../src/constants/macros"

export async function seedGearDetails() {

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





}