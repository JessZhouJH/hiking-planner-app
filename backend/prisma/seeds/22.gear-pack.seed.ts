import { prisma } from "./seed-client"

import { upsertGearPackData } from '../../src/services/gear/gear_pack.service'
import { upsertGearPackComponentData } from '../../src/services/gear/gear_pack_component.service'
import { Visibility, Status } from "../../src/generated/prisma/enums"
import { SYSTEM_USER_ID } from "../../src/constants/macros"

import { findUserByName } from '../../src/services/access_control/user.service'
import { findGearTypeByName } from '../../src/services/gear/gear_type.service'

export async function seedGearPack() {
    const adam = await findUserByName("Adam")
    const ben = await findUserByName("Ben")
    const jessie = await findUserByName("Jessie")

    // gear pack
    const sleeping_system_hut = await upsertGearPackData("Sleeping System (Hut)", SYSTEM_USER_ID, SYSTEM_USER_ID, true, Visibility.PUBLIC)
    const sleeping_system_campsite = await upsertGearPackData("Sleeping System (Campstie)", SYSTEM_USER_ID, SYSTEM_USER_ID, true, Visibility.PUBLIC)
    const multiday_essential_clothing = await upsertGearPackData("Multiday Essential Clothing", adam[0].id, SYSTEM_USER_ID, false, Visibility.PUBLIC)
    const safety_kit = await upsertGearPackData("Safety Kit", ben[0].id, SYSTEM_USER_ID, true, Visibility.PUBLIC)
    const jessie_big_pack = await upsertGearPackData("Trekking Ultimate Pack", jessie[0].id, SYSTEM_USER_ID, false, Visibility.PUBLIC)
    
    // gear pack component
    const sleeping_bag_type = await findGearTypeByName("Sleeping Bag")
    const sleeping_bag_liner_type = await findGearTypeByName("Sleeping Bag Liner")
    const pillow_type = await findGearTypeByName("Pillow")
    const tent_type = await findGearTypeByName("Tent")
    const sleeping_mat_type = await findGearTypeByName("Sleeping Mat")
    const trekking_pack_type = await findGearTypeByName("Trekking Pack")
    const foldable_pack_type = await findGearTypeByName("Foldable Pack")
    const cookware_type = await findGearTypeByName("Cookware")
    const stove_type = await findGearTypeByName("Stove")
    const headtorch_type = await findGearTypeByName("Headtorch")
    const hiking_boots_type = await findGearTypeByName("'Hiking Boots")
    const shell_jacket_type = await findGearTypeByName("Shell Jacket")
    const down_jacket_type = await findGearTypeByName("Down Jacket")
    const fleece_type = await findGearTypeByName("Fleece")
    const pants_type = await findGearTypeByName("Pants")
    const base_layer_type = await findGearTypeByName("Base Layer")
    const tops_type = await findGearTypeByName("Tops")
    const towel_type = await findGearTypeByName("Towel")
    const trekking_pole_type = await findGearTypeByName("Trekking Pole")

    await upsertGearPackComponentData(SYSTEM_USER_ID, sleeping_system_hut.id, sleeping_bag_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, sleeping_system_hut.id, sleeping_bag_liner_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, sleeping_system_hut.id, pillow_type?.id)

    await upsertGearPackComponentData(SYSTEM_USER_ID, sleeping_system_campsite.id, sleeping_bag_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, sleeping_system_campsite.id, sleeping_bag_liner_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, sleeping_system_campsite.id, pillow_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, sleeping_system_campsite.id, tent_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, sleeping_system_campsite.id, sleeping_mat_type?.id, undefined, true)

    await upsertGearPackComponentData(SYSTEM_USER_ID, multiday_essential_clothing.id, down_jacket_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, multiday_essential_clothing.id, fleece_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, multiday_essential_clothing.id, pants_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, multiday_essential_clothing.id, base_layer_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, multiday_essential_clothing.id, shell_jacket_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, multiday_essential_clothing.id, hiking_boots_type?.id, undefined, true)

    await upsertGearPackComponentData(SYSTEM_USER_ID, safety_kit.id, headtorch_type?.id)

    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, sleeping_bag_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, sleeping_bag_liner_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, pillow_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, tent_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, sleeping_mat_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, trekking_pack_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, foldable_pack_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, cookware_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, stove_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, headtorch_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, hiking_boots_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, shell_jacket_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, down_jacket_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, fleece_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, pants_type?.id, undefined, true)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, base_layer_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, tops_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, towel_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, trekking_pole_type?.id)
    await upsertGearPackComponentData(SYSTEM_USER_ID, jessie_big_pack.id, base_layer_type?.id, undefined, false, "backup")

}