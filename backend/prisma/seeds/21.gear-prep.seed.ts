import { prisma } from './seed-client'

import { SYSTEM_USER_ID, MEDIA_PATH_PREFIX } from '../../src/constants/macros'
import { Status, ValueType } from '../../src/generated/prisma/enums'

import { findUnitByName } from '../../src/services/common/unit.service'
import { upsertBrandData } from '../../src/services/gear/brand.service'
import { upsertGearTypeData } from '../../src/services/gear/gear_type.service'
import { upsertGearTypeRelationData } from '../../src/services/gear/gear_type_relation.service'
import { upsertGearSpecsDefitionData } from '../../src/services/gear/gear_specs_definition.service'

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


export async function seedGearPrep() {

    // Brand
    const osprey_brand = await upsertBrandData(
        'Osprey',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Osprey-logo.png`
    )
    const sea_to_summit_brand = await upsertBrandData(
        'Sea To Summit',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Sea-to-summit-logo.png`
    )
    const montbell_brand = await upsertBrandData(
        'Montbell',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Montbell-logo.webp`
    )
    const macpac_brand = await upsertBrandData(
        'Macpac',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/macpac-logo.jpg`
    )
    const merrell_brand = await upsertBrandData(
        'Merrell',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Merrell-Logo.png`
    )
    const gregory_brand = await upsertBrandData(
        'Gregory',
        SYSTEM_USER_ID,
        `${MEDIA_PATH_PREFIX}/brand-logo/Gregory-logo.png`
    )
    const naturehike_brand = await upsertBrandData(
        'Naturehike',
        SYSTEM_USER_ID
    )
    const thermarest_brand = await upsertBrandData(
        'Therm-A-Rest',
        SYSTEM_USER_ID
    )

    // GearType
    const tent_type = await upsertGearTypeData('Tent', SYSTEM_USER_ID)
    const sleeping_bag_type = await upsertGearTypeData(
        'Sleeping Bag',
        SYSTEM_USER_ID
    )
    const sleeping_mat_type = await upsertGearTypeData(
        'Sleeping Mat',
        SYSTEM_USER_ID
    )
    const sleeping_pad_type = await upsertGearTypeData(
        'Sleeping Pad',
        SYSTEM_USER_ID
    )
    const sleeping_bag_liner_type = await upsertGearTypeData(
        'Sleeping Bag Liner',
        SYSTEM_USER_ID
    )
    const pillow_type = await upsertGearTypeData('Pillow', SYSTEM_USER_ID)
    const packs_type = await upsertGearTypeData('Packs', SYSTEM_USER_ID)
    const backpack_type = await upsertGearTypeData('Backpack', SYSTEM_USER_ID)
    const daypack_type = await upsertGearTypeData('Daypack', SYSTEM_USER_ID)
    const trekking_pack_type = await upsertGearTypeData(
        'Trekking Pack',
        SYSTEM_USER_ID
    )
    const hydration_pack_type = await upsertGearTypeData(
        'Hydration Pack',
        SYSTEM_USER_ID
    )
    const multiday_pack_type = await upsertGearTypeData(
        'Multiday Pack',
        SYSTEM_USER_ID
    )
    const foldable_pack_type = await upsertGearTypeData(
        'Foldable Pack',
        SYSTEM_USER_ID
    )
    const waist_pack_type = await upsertGearTypeData('Waist Pack', SYSTEM_USER_ID)
    const trekking_pole_type = await upsertGearTypeData(
        'Trekking Pole',
        SYSTEM_USER_ID
    )
    const cookware_type = await upsertGearTypeData('Cookware', SYSTEM_USER_ID)
    const stove_type = await upsertGearTypeData('Stove', SYSTEM_USER_ID)
    const headlamp_type = await upsertGearTypeData('Headlamp', SYSTEM_USER_ID)
    const headtorch_type = await upsertGearTypeData('Headtorch', SYSTEM_USER_ID)
    const footwear_type = await upsertGearTypeData('Footwear', SYSTEM_USER_ID)
    const hiking_boots_type = await upsertGearTypeData(
        'Hiking Boots',
        SYSTEM_USER_ID
    )
    const hiking_shoes_type = await upsertGearTypeData(
        'Hiking Shoes',
        SYSTEM_USER_ID
    )
    const trail_running_shoes_type = await upsertGearTypeData(
        'Trail Running',
        SYSTEM_USER_ID
    )
    const rain_jacket_type = await upsertGearTypeData('Rain Jacket', SYSTEM_USER_ID)
    const down_jacket_type = await upsertGearTypeData('Down Jacket', SYSTEM_USER_ID)
    const shell_jacket_type = await upsertGearTypeData(
        'Shell Jacket',
        SYSTEM_USER_ID
    )
    const jacket_type = await upsertGearTypeData('Jacket', SYSTEM_USER_ID)
    const fleece_jacket_type = await upsertGearTypeData(
        'Fleece Jacket',
        SYSTEM_USER_ID
    )
    const fleece_type = await upsertGearTypeData('Fleece', SYSTEM_USER_ID)
    const pants_type = await upsertGearTypeData('Pants', SYSTEM_USER_ID)
    const shorts_type = await upsertGearTypeData('Shorts', SYSTEM_USER_ID)
    const tops_type = await upsertGearTypeData('Tops', SYSTEM_USER_ID)
    const base_layer_type = await upsertGearTypeData('Base Layer', SYSTEM_USER_ID)
    const towel_type = await upsertGearTypeData('Towel', SYSTEM_USER_ID)

    // GearTypeRelation
    await upsertGearTypeRelationData(
        packs_type.id,
        backpack_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        packs_type.id,
        waist_pack_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        packs_type.id,
        foldable_pack_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        backpack_type.id,
        daypack_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        backpack_type.id,
        trekking_pack_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        backpack_type.id,
        multiday_pack_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        footwear_type.id,
        hiking_boots_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        footwear_type.id,
        hiking_shoes_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        footwear_type.id,
        trail_running_shoes_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        jacket_type.id,
        rain_jacket_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        jacket_type.id,
        down_jacket_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        jacket_type.id,
        shell_jacket_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        jacket_type.id,
        fleece_jacket_type.id,
        SYSTEM_USER_ID
    )
    await upsertGearTypeRelationData(
        fleece_type.id,
        fleece_jacket_type.id,
        SYSTEM_USER_ID
    )

    // GearSpecsDefinition

    // backpack sepcs
    const backpack_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", backpack_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const backpack_capacity_spec_definition = await upsertGearSpecsDefitionData(
        "Capacity", backpack_type.id, ValueType.VOLUME, SYSTEM_USER_ID, true, true, liter_unit?.id
    )
    const backpack_recommended_load_spec_definition = await upsertGearSpecsDefitionData(
        "Recommended Load", backpack_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, kilogram_unit?.id
    )
    const backpack_torso_length_spec_definition = await upsertGearSpecsDefitionData(
        "Torso Length", backpack_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, centimeter_unit?.id
    )
    const backpack_back_panel_technology_spec_definition = await upsertGearSpecsDefitionData(
        "Back Panel Technology", backpack_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // footwear specs
    const footwear_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", footwear_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const footwear_heel_to_toe_drop_spec_definition = await upsertGearSpecsDefitionData(
        "Heel-to-Toe Drop", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, millimeter_unit?.id
    )
    const footwear_stack_height_spec_definition = await upsertGearSpecsDefitionData(
        "Stack Height", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, millimeter_unit?.id
    )
    const footwear_shaft_height_spec_definition = await upsertGearSpecsDefitionData(
        "Shaft Height", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )
    const footwear_upper_material_spec_definition = await upsertGearSpecsDefitionData(
        "Upper Material", footwear_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const footwear_waterproof_technology_spec_definition = await upsertGearSpecsDefitionData(
        "Waterproof Technology", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, false
    )
    const footwear_outsole_spec_definition = await upsertGearSpecsDefitionData(
        "Outsole", footwear_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, false
    )

    // sleeping bag spcs
    const sleeping_bag_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", sleeping_bag_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const sleeping_bag_comfortable_temperature_spec_definition = await upsertGearSpecsDefitionData(
        "Comfortable Temperature", sleeping_bag_type.id, ValueType.TEMPERATURE, SYSTEM_USER_ID, true, false, celsius_unit?.id
    )  
    const sleeping_bag_limit_temperature_spec_definition = await upsertGearSpecsDefitionData(
        "Limit Temperature", sleeping_bag_type.id, ValueType.TEMPERATURE, SYSTEM_USER_ID, true, false, celsius_unit?.id
    )  
    const sleeping_bag_extreme_temperature_spec_definition = await upsertGearSpecsDefitionData(
        "Extreme Temperature", sleeping_bag_type.id, ValueType.TEMPERATURE, SYSTEM_USER_ID, false, false, celsius_unit?.id
    )  
    const sleeping_bag_packed_volume_spec_definition = await upsertGearSpecsDefitionData(
        "Packed Volume", sleeping_bag_type.id, ValueType.VOLUME, SYSTEM_USER_ID, false, true, liter_unit?.id
    )  
    const sleeping_bag_length_spec_definition = await upsertGearSpecsDefitionData(
        "Length", sleeping_bag_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, false, centimeter_unit?.id
    )
    const sleeping_bag_fill_material_spec_definition = await upsertGearSpecsDefitionData(
        "Fill Material", sleeping_bag_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const sleeping_bag_insulation_type_spec_definition = await upsertGearSpecsDefitionData(
        "Insulation Type", sleeping_bag_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // sleeping bag liner specs
    const sleeping_bag_liner_main_material_spec_definition = await upsertGearSpecsDefitionData(
        "Main Material", sleeping_bag_liner_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const sleeping_bag_liner_thermal_function_spec_definition = await upsertGearSpecsDefitionData(
        "Thermal Function", sleeping_bag_liner_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // pillow specs
    const pillow_main_material_spec_definition = await upsertGearSpecsDefitionData(
        "Main Material", pillow_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // sleeping mat specs
    const sleeping_mat_r_value_spec_definition = await upsertGearSpecsDefitionData(
        "R-Value", sleeping_mat_type.id, ValueType.R_VALUE, SYSTEM_USER_ID, true, false
    )
    const sleeping_mat_length_spec_definition = await upsertGearSpecsDefitionData(
        "Length", sleeping_mat_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, centimeter_unit?.id
    )
    const sleeping_mat_width_spec_definition = await upsertGearSpecsDefitionData(
        "Width", sleeping_mat_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, centimeter_unit?.id
    )
    const sleeping_mat_thickness_spec_definition = await upsertGearSpecsDefitionData(
        "Thickness", sleeping_mat_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )
    const sleeping_mat_packed_length_spec_definition = await upsertGearSpecsDefitionData(
        "Packed Length", sleeping_mat_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )
    const sleeping_mat_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", sleeping_mat_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const sleeping_mat_insulation_material_spec_definition = await upsertGearSpecsDefitionData(
        "Insulation Material", sleeping_mat_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const sleeping_mat_shell_material_spec_definition = await upsertGearSpecsDefitionData(
        "Shell Material", sleeping_mat_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const sleeping_mat_valve_type_spec_definition = await upsertGearSpecsDefitionData(
        "Valve Type", sleeping_mat_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // tent specs
    const tent_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", tent_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const tent_packed_length_spec_definition = await upsertGearSpecsDefitionData(
        "Packed Length", tent_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )
    const tent_floor_area_spec_definition = await upsertGearSpecsDefitionData(
        "Floor Area", tent_type.id, ValueType.AREA, SYSTEM_USER_ID, true, false, squaremeter_unit?.id
    )
    const tent_max_person_spec_definition = await upsertGearSpecsDefitionData(
        "Max Person", tent_type.id, ValueType.COUNT, SYSTEM_USER_ID, true, false
    )
    const tent_waterproof_technology_spec_definition = await upsertGearSpecsDefitionData(
        "Waterproof Technology", tent_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const tent_floor_material_spec_definition = await upsertGearSpecsDefitionData(
        "Floor Material", tent_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const tent_fly_material_spec_definition = await upsertGearSpecsDefitionData(
        "Fly Material", tent_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    const tent_pole_material_spec_definition = await upsertGearSpecsDefitionData(
        "Pole Material", tent_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // rain jacket specs
    const rain_jacket_waterproof_rating_spec_definition = await upsertGearSpecsDefitionData(
        "Waterproof Rating", rain_jacket_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, false, millimeter_unit?.id
    )
    const rain_jacket_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", rain_jacket_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, false, true, gram_unit?.id
    )
    const rain_jacket_waterproof_technology_spec_definition = await upsertGearSpecsDefitionData(
        "Waterproof Technology", rain_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const rain_jacket_fabric_construction_spec_definition = await upsertGearSpecsDefitionData(
        "Fabric Construction", rain_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const rain_jacket_main_material_spec_definition = await upsertGearSpecsDefitionData(
        "Main Material", rain_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // down jacket specs
    const down_jacket_insulation_material_spec_definition = await upsertGearSpecsDefitionData(
        "Insulation Material", down_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const down_jacket_fill_material_spec_definition = await upsertGearSpecsDefitionData(
        "Fill Material", down_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const down_jacket_shell_material_spec_definition = await upsertGearSpecsDefitionData(
        "Shell Material", down_jacket_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )

    // fleece specs
    const fleece_main_material_spec_definition = await upsertGearSpecsDefitionData(
        "Main Material", fleece_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // base layer specs
    const base_layer_main_material_spec_definition = await upsertGearSpecsDefitionData(
        "Main Material", base_layer_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // pants specs
    const pants_main_material_spec_definition = await upsertGearSpecsDefitionData(
        "Main Material", pants_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )
    const pants_stretch_material_spec_definition = await upsertGearSpecsDefitionData(
        "Stretch Material", pants_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // towel specs
    const towel_main_material_spec_definition = await upsertGearSpecsDefitionData(
        "Main Material", towel_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

    // headtorch specs
    const headtorch_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", headtorch_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, false, false, gram_unit?.id
    )
    const headtorch_max_lumens_spec_definition = await upsertGearSpecsDefitionData(
        "Maximum Lumens", headtorch_type.id, ValueType.LUMINOUS_FLUX, SYSTEM_USER_ID, true, false, lumen_unit?.id
    )
    const headtorch_battery_runtime_spec_definition = await upsertGearSpecsDefitionData(
        "Battery Runtime", headtorch_type.id, ValueType.DURATION, SYSTEM_USER_ID, true, false, hour_unit?.id
    )
    const headtorch_ingress_protection_rating_spec_definition = await upsertGearSpecsDefitionData(
        "Ingress Protection Rating", headtorch_type.id, ValueType.TEXT, SYSTEM_USER_ID, true, false
    )

     // cookware specs
    const cookware_main_material_spec_definition = await upsertGearSpecsDefitionData(
        "Main Material", cookware_type.id, ValueType.TEXT, SYSTEM_USER_ID, false, false
    )
    
    // trekking pole specs
    const trekking_pole_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", trekking_pole_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, true, true, gram_unit?.id
    )
    const trekking_pole_pole_length_spec_definition = await upsertGearSpecsDefitionData(
        "Pole Length", trekking_pole_type.id, ValueType.LENGTH, SYSTEM_USER_ID, true, true, centimeter_unit?.id
    )
    const trekking_pole_packed_length_spec_definition = await upsertGearSpecsDefitionData(
        "Packed Length", trekking_pole_type.id, ValueType.LENGTH, SYSTEM_USER_ID, false, true, centimeter_unit?.id
    )

    // hydration pack specs
    const hydration_pack_weight_spec_definition = await upsertGearSpecsDefitionData(
        "Weight", hydration_pack_type.id, ValueType.WEIGHT, SYSTEM_USER_ID, false, true, gram_unit?.id
    )
    const hydration_pack_water_capacity_spec_definition = await upsertGearSpecsDefitionData(
        "Water Capacity", hydration_pack_type.id, ValueType.VOLUME, SYSTEM_USER_ID, true, true, liter_unit?.id
    )
}