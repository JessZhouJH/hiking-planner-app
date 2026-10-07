import { prisma } from './seed-client'

import { SYSTEM_USER_ID, MEDIA_PATH_PREFIX } from '../../src/constants/macros'
import { Status, ValueType } from '../../src/generated/prisma/enums'

// get already seeded value from Unit table
const kilogram_unit = await prisma.unit.findFirst({
    where: { name: 'Kilogram' },
})
const gram_unit = await prisma.unit.findFirst({
    where: { name: 'Gram' },
})
const celsius_unit = await prisma.unit.findFirst({
    where: { name: 'Celsius' },
})
const meter_unit = await prisma.unit.findFirst({
    where: { name: 'Meter' },
})
const centimeter_unit = await prisma.unit.findFirst({
    where: { name: 'Centimeter' },
})

export async function seedGearPrep() {
    // Brand
    async function createBrand(
        name: string,
        user_id: number,
        logo_img_key?: string
    ) {
        const new_brand = await prisma.brand.upsert({
            where: { name: name },
            update: {
                updated_by_id: user_id,
                ...(logo_img_key !== undefined && {
                    logo_img_key: logo_img_key,
                }),
            },
            create: {
                name: name,
                created_by_id: user_id,
                updated_by_id: user_id,
                ...(logo_img_key !== undefined && {
                    logo_img_key: logo_img_key,
                }),
            },
        })
        return new_brand
    }

    const osprey_brand = await createBrand(
        'Osprey',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Osprey-logo.png`
    )
    const sea_to_summit_brand = await createBrand(
        'Sea To Summit',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Sea-to-summit-logo.png`
    )
    const montbell_brand = await createBrand(
        'Montbell',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Montbell-logo.webp`
    )
    const macpac_brand = await createBrand(
        'Macpac',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/macpac-logo.jpg`
    )
    const merrell_brand = await createBrand(
        'Merrell',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Merrell-Logo.png`
    )

    // GearType
    async function createGearType(
        name: string,
        user_id: number,
        is_comparable?: boolean
    ) {
        const new_gear_type = await prisma.gearType.upsert({
            where: { name: name },
            update: {
                updated_by_id: user_id,
                ...(is_comparable !== undefined && {
                    is_comparable: is_comparable,
                }),
            },
            create: {
                name: name,
                created_by_id: user_id,
                updated_by_id: user_id,
                ...(is_comparable !== undefined && {
                    is_comparable: is_comparable,
                }),
            },
        })
        return new_gear_type
    }
    const tent_type = await createGearType('Tent', SYSTEM_USER_ID)
    const sleeping_bag_type = await createGearType(
        'Sleeping Bag',
        SYSTEM_USER_ID
    )
    const sleeping_mat_type = await createGearType(
        'Sleeping Mat',
        SYSTEM_USER_ID
    )
    const sleeping_pad_type = await createGearType(
        'Sleeping Pad',
        SYSTEM_USER_ID
    )
    const sleeping_bag_liner_type = await createGearType(
        'Sleeping Bag Liner',
        SYSTEM_USER_ID
    )
    const pillow_type = await createGearType('Pillow', SYSTEM_USER_ID)
    const packs_type = await createGearType('Packs', SYSTEM_USER_ID)
    const backpack_type = await createGearType('Backpack', SYSTEM_USER_ID)
    const daypack_type = await createGearType('Daypack', SYSTEM_USER_ID)
    const trekking_pack_type = await createGearType(
        'Trekking Pack',
        SYSTEM_USER_ID
    )
    const multiday_pack_type = await createGearType(
        'Multiday Pack',
        SYSTEM_USER_ID
    )
    const foldable_pack_type = await createGearType(
        'Foldable Pack',
        SYSTEM_USER_ID
    )
    const waist_pack_type = await createGearType('Waist Pack', SYSTEM_USER_ID)
    const pot_pan_type = await createGearType('Pot & Pan', SYSTEM_USER_ID)
    const stove_type = await createGearType('Stove', SYSTEM_USER_ID)
    const headlamp_type = await createGearType('Headlamp', SYSTEM_USER_ID)
    const headtorch_type = await createGearType('Headtorch', SYSTEM_USER_ID)
    const footwear_type = await createGearType('Footwear', SYSTEM_USER_ID)
    const hiking_boots_type = await createGearType(
        'Hiking Boots',
        SYSTEM_USER_ID
    )
    const hiking_shoes_type = await createGearType(
        'Hiking Shoes',
        SYSTEM_USER_ID
    )
    const trail_running_shoes_type = await createGearType(
        'Trail Running',
        SYSTEM_USER_ID
    )
    const rain_jacket_type = await createGearType('Rain Jacket', SYSTEM_USER_ID)
    const down_jacket_type = await createGearType('Down Jacket', SYSTEM_USER_ID)
    const shell_jacket_type = await createGearType(
        'Shell Jacket',
        SYSTEM_USER_ID
    )
    const jacket_type = await createGearType('Jacket', SYSTEM_USER_ID)
    const fleece_jacket_type = await createGearType(
        'Fleece Jacket',
        SYSTEM_USER_ID
    )
    const fleece_type = await createGearType('Fleece', SYSTEM_USER_ID)
    const pants_type = await createGearType('Pants', SYSTEM_USER_ID)
    const shorts_type = await createGearType('Shorts', SYSTEM_USER_ID)
    const tops_type = await createGearType('Tops', SYSTEM_USER_ID)

    // GearTypeRelation
    async function createGearTypeRelation(
        parent_id: number,
        child_id: number,
        user_id: number
    ) {
        const existing_gear_tag_relation =
            await prisma.gearTypeRelation.findFirst({
                where: {
                    parent_gear_type_id: parent_id,
                    child_gear_type_id: child_id,
                    status: Status.ACTIVE,
                },
            })
        if (existing_gear_tag_relation) return existing_gear_tag_relation
        const new_gear_type_relation = await prisma.gearTypeRelation.create({
            data: {
                parent_gear_type_id: parent_id,
                child_gear_type_id: child_id,
                created_by_id: user_id,
                updated_by_id: user_id,
            },
        })
        return new_gear_type_relation
    }

    await createGearTypeRelation(
        packs_type.id,
        backpack_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        packs_type.id,
        waist_pack_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        packs_type.id,
        foldable_pack_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        backpack_type.id,
        daypack_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        backpack_type.id,
        trekking_pack_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        backpack_type.id,
        multiday_pack_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        footwear_type.id,
        hiking_boots_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        footwear_type.id,
        hiking_shoes_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        footwear_type.id,
        trail_running_shoes_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        jacket_type.id,
        rain_jacket_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        jacket_type.id,
        down_jacket_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        jacket_type.id,
        shell_jacket_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        jacket_type.id,
        fleece_jacket_type.id,
        SYSTEM_USER_ID
    )
    await createGearTypeRelation(
        fleece_type.id,
        fleece_jacket_type.id,
        SYSTEM_USER_ID
    )

    // GearSpecsDefinition
    async function createGearSpecsDefition(
        name: string,
        gear_type_id: number,
        value_type: ValueType,
        user_id: number,
        is_key_spec?: boolean,
        is_variant_sensitive?: boolean,
        default_unit_id?: number
    ) {
        const new_gear_specs_definition =
            await prisma.gearSpecsDefinition.upsert({
                where: { name: name },
                update: {},
                create: {
                    name: name,
                    gear_type_id: gear_type_id,
                    value_type: value_type,
                    ...(is_key_spec !== undefined && {
                        is_key_spec: is_key_spec,
                    }),
                    ...(is_variant_sensitive !== undefined && {
                        is_variant_sensitive: is_variant_sensitive,
                    }),
                    ...(default_unit_id !== undefined && {
                        default_unit_id: default_unit_id,
                    }),
                    created_by_id: user_id,
                    updated_by_id: user_id,
                },
            })
        return new_gear_specs_definition
    }
}
