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
const millimeter_unit = await prisma.unit.findFirst({
    where: { name: 'Millimeter' },
})
const liter_unit = await prisma.unit.findFirst({
    where: { name: 'Liter' },
})
const milliliter_unit = await prisma.unit.findFirst({
    where: { name: 'Milliliter' },
})
const squaremeter_unit = await prisma.unit.findFirst({
    where: { name: 'Squaremeter' },
})
const lumen_unit = await prisma.unit.findFirst({
    where: { name: 'Lumen' },
})
const hour_unit = await prisma.unit.findFirst({
    where: { name: 'Hour' },
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
    const hydration_pack_type = await createGearType(
        'Hydration Pack',
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
    const trekking_pole_type = await createGearType(
        'Trekking Pole',
        SYSTEM_USER_ID
    )
    const cookware_type = await createGearType('Cookware', SYSTEM_USER_ID)
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
    const base_layer_type = await createGearType('Base Layer', SYSTEM_USER_ID)
    const towel_type = await createGearType('Towel', SYSTEM_USER_ID)

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
        const exisiting_gear_specs_definition = await prisma.gearSpecsDefinition.findFirst({
            where: { 
                name: name,
                gear_type_id: gear_type_id,
                status: Status.ACTIVE
            }
        })
        
        if (exisiting_gear_specs_definition) {
            return await prisma.gearSpecsDefinition.update({
                where: { id: exisiting_gear_specs_definition.id },
                data: {
                    updated_by_id: user_id,
                    value_type: value_type,
                    ...(is_key_spec !== undefined && {
                        is_key_spec: is_key_spec
                    }),
                    ...(is_variant_sensitive !== undefined && {
                        is_variant_sensitive: is_variant_sensitive
                    }),
                    ...(default_unit_id !== undefined && {
                        default_unit_id: default_unit_id
                    })
                }
            })
        }
        return await prisma.gearSpecsDefinition.create({
                data: {
                    name: name,
                    gear_type_id: gear_type_id,
                    value_type: value_type,
                    default_unit_id: default_unit_id,
                    is_key_spec: is_key_spec ?? false,
                    is_variant_sensitive: is_variant_sensitive ?? false,
                    created_by_id: user_id,
                    updated_by_id: user_id

                }
                
            })
    }
    // backpack sepcs
    const backpack_weight_spec_definition = await createGearSpecsDefition(
        "Weight", backpack_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const backpack_capacity_spec_definition = await createGearSpecsDefition(
        "Capacity", backpack_type.id, ValueType.VOLUME, SYSTEM_USER_ID, true, true, liter_unit?.id
    )
    const backpack_recommended_load_spec_definition = await createGearSpecsDefition(
        "Recommended Load", backpack_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, kilogram_unit?.id
    )
    const backpack_torso_length_spec_definition = await createGearSpecsDefition(
        "Torso Length", backpack_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, centimeter_unit?.id
    )
    const backpack_back_panel_technology_spec_definition = await createGearSpecsDefition(
        "Back Panel Technology", backpack_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // footwear specs
    const footwear_weight_spec_definition = await createGearSpecsDefition(
        "Weight", footwear_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const footwear_heel_to_toe_drop_spec_definition = await createGearSpecsDefition(
        "Heel-to-Toe Drop", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, millimeter_unit?.id
    )
    const footwear_stack_height_spec_definition = await createGearSpecsDefition(
        "Stack Height", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, millimeter_unit?.id
    )
    const footwear_shaft_height_spec_definition = await createGearSpecsDefition(
        "Shaft Height", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )
    const footwear_upper_material_spec_definition = await createGearSpecsDefition(
        "Upper Material", footwear_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const footwear_waterproof_technology_spec_definition = await createGearSpecsDefition(
        "Waterproof Technology", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, false
    )
    const footwear_outsole_spec_definition = await createGearSpecsDefition(
        "Outsole", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, false
    )

    // sleeping bag spcs
    const sleeping_bag_weight_spec_definition = await createGearSpecsDefition(
        "Weight", sleeping_bag_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const sleeping_bag_comfortable_temperature_spec_definition = await createGearSpecsDefition(
        "Comfortable Temperature", sleeping_bag_type.id, ValueType.TEMPERATURE, SYSTEM_USER_ID, true, false, celsius_unit?.id
    )  
    const sleeping_bag_limit_temperature_spec_definition = await createGearSpecsDefition(
        "Limit Temperature", sleeping_bag_type.id, ValueType.TEMPERATURE, SYSTEM_USER_ID, true, false, celsius_unit?.id
    )  
    const sleeping_bag_extreme_temperature_spec_definition = await createGearSpecsDefition(
        "Extreme Temperature", sleeping_bag_type.id, ValueType.TEMPERATURE, SYSTEM_USER_ID, false, false, celsius_unit?.id
    )  
    const sleeping_bag_packed_volume_spec_definition = await createGearSpecsDefition(
        "Packed Volume", sleeping_bag_type.id, ValueType.VOLUME, SYSTEM_USER_ID, false, true, liter_unit?.id
    )  
    const sleeping_bag_length_spec_definition = await createGearSpecsDefition(
        "Length", sleeping_bag_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, false, centimeter_unit?.id
    )
    const sleeping_bag_fill_material_spec_definition = await createGearSpecsDefition(
        "Fill Material", sleeping_bag_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const sleeping_bag_insulation_type_spec_definition = await createGearSpecsDefition(
        "Insulation Type", sleeping_bag_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // sleeping bag liner specs
    const sleeping_bag_liner_main_material_spec_definition = await createGearSpecsDefition(
        "Main Material", sleeping_bag_liner_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const sleeping_bag_liner_thermal_function_spec_definition = await createGearSpecsDefition(
        "Thermal Function", sleeping_bag_liner_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // pillow specs
    const pillow_main_material_spec_definition = await createGearSpecsDefition(
        "Main Material", pillow_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // sleeping mat specs
    const sleeping_mat_r_value_spec_definition = await createGearSpecsDefition(
        "R-Value", sleeping_mat_type.id, ValueType.R_VALUE, SYSTEM_USER_ID, true, false
    )
    const sleeping_mat_length_spec_definition = await createGearSpecsDefition(
        "Length", sleeping_mat_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, centimeter_unit?.id
    )
    const sleeping_mat_width_spec_definition = await createGearSpecsDefition(
        "Width", sleeping_mat_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, centimeter_unit?.id
    )
    const sleeping_mat_thickness_spec_definition = await createGearSpecsDefition(
        "Thickness", sleeping_mat_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )
    const sleeping_mat_packed_length_spec_definition = await createGearSpecsDefition(
        "Packed Length", sleeping_mat_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )
    const sleeping_mat_weight_spec_definition = await createGearSpecsDefition(
        "Weight", sleeping_mat_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const sleeping_mat_insulation_material_spec_definition = await createGearSpecsDefition(
        "Insulation Material", sleeping_mat_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const sleeping_mat_shell_material_spec_definition = await createGearSpecsDefition(
        "Shell Material", sleeping_mat_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const sleeping_mat_valve_type_spec_definition = await createGearSpecsDefition(
        "Valve Type", sleeping_mat_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // tent specs
    const tent_weight_spec_definition = await createGearSpecsDefition(
        "Weight", tent_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const tent_packed_length_spec_definition = await createGearSpecsDefition(
        "Packed Length", tent_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )
    const tent_floor_area_spec_definition = await createGearSpecsDefition(
        "Floor Area", tent_type.id, ValueType.AREA, SYSTEM_USER_ID, true, false, squaremeter_unit?.id
    )
    const tent_max_person_spec_definition = await createGearSpecsDefition(
        "Max Person", tent_type.id, ValueType.COUNT, SYSTEM_USER_ID, true, false
    )
    const tent_waterproof_technology_spec_definition = await createGearSpecsDefition(
        "Waterproof Technology", tent_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const tent_floor_material_spec_definition = await createGearSpecsDefition(
        "Floor Material", tent_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const tent_fly_material_spec_definition = await createGearSpecsDefition(
        "Fly Material", tent_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const tent_pole_material_spec_definition = await createGearSpecsDefition(
        "Pole Material", tent_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // rain jacket specs
    const rain_jacket_waterproof_rating_spec_definition = await createGearSpecsDefition(
        "Waterproof Rating", rain_jacket_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, false, millimeter_unit?.id
    )
    const rain_jacket_weight_spec_definition = await createGearSpecsDefition(
        "Weight", rain_jacket_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, false, true, gram_unit?.id
    )
    const rain_jacket_waterproof_technology_spec_definition = await createGearSpecsDefition(
        "Waterproof Technology", rain_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const rain_jacket_fabric_construction_spec_definition = await createGearSpecsDefition(
        "Fabric Construction", rain_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const rain_jacket_main_material_spec_definition = await createGearSpecsDefition(
        "Main Material", rain_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // down jacket specs
    const down_jacket_insulation_material_spec_definition = await createGearSpecsDefition(
        "Insulation Material", down_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const down_jacket_fill_material_spec_definition = await createGearSpecsDefition(
        "Fill Material", down_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const down_jacket_shell_material_spec_definition = await createGearSpecsDefition(
        "Shell Material", down_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // fleece specs
    const fleece_main_material_spec_definition = await createGearSpecsDefition(
        "Main Material", fleece_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // base layer specs
    const base_layer_main_material_spec_definition = await createGearSpecsDefition(
        "Main Material", base_layer_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // pants specs
    const pants_main_material_spec_definition = await createGearSpecsDefition(
        "Main Material", pants_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const pants_stretch_material_spec_definition = await createGearSpecsDefition(
        "Stretch Material", pants_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // towel specs
    const towel_main_material_spec_definition = await createGearSpecsDefition(
        "Main Material", towel_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // headtorch specs
    const headtorch_weight_spec_definition = await createGearSpecsDefition(
        "Weight", headtorch_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, false, false, gram_unit?.id
    )
    const headtorch_max_lumens_spec_definition = await createGearSpecsDefition(
        "Maximum Lumens", headtorch_type.id, ValueType.LUMINOUS_FLUX, SYSTEM_USER_ID, true, false, lumen_unit?.id
    )
    const headtorch_battery_runtime_spec_definition = await createGearSpecsDefition(
        "Battery Runtime", headtorch_type.id, ValueType.DURATION, SYSTEM_USER_ID, true, false, hour_unit?.id
    )
    const headtorch_ingress_protection_rating_spec_definition = await createGearSpecsDefition(
        "Ingress Protection Rating", headtorch_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

     // cookware specs
    const cookware_main_material_spec_definition = await createGearSpecsDefition(
        "Main Material", cookware_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    
    // trekking pole specs
    const trekking_pole_weight_spec_definition = await createGearSpecsDefition(
        "Weight", trekking_pole_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const trekking_pole_pole_length_spec_definition = await createGearSpecsDefition(
        "Pole Length", trekking_pole_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, centimeter_unit?.id
    )
    const trekking_pole_packed_length_spec_definition = await createGearSpecsDefition(
        "Packed Length", trekking_pole_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )

    // hydration pack specs
    const hydration_pack_weight_spec_definition = await createGearSpecsDefition(
        "Weight", hydration_pack_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, false, true, gram_unit?.id
    )
    const hydration_pack_water_capacity_spec_definition = await createGearSpecsDefition(
        "Water Capacity", hydration_pack_type.id, ValueType.VOLUME, SYSTEM_USER_ID, true, true, liter_unit?.id
    )

    // specs
    // const SPEC_NAME _spec_definition = await createGearSpecsDefition(
    //     NAME, GEAR_TYPE.id, ValueType.TEXT, SYSTEM_USER_ID, IS_KEY_SPEC, false
    // )
}
