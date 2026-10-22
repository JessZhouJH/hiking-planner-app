import { prisma } from './seed-client'
import { findNonArchivedUnitByName } from '../../src/services/common/unit.service'
import { findNonArchivedBrandByName } from '../../src/services/gear/brand.service'
import { findNonArchivedTagByName } from '../../src/services/common/tag.service'
import { findNonArchivedGearTypeByName } from '../../src/services/gear/gear-type.service'
import { findNonArchivedGearSpecsDefinitionByNameAndType } from '../../src/services/gear/gear-specs-definition.service'

import { upsertGearData } from '../../src/services/gear/gear.service'
import { upsertDescriptiveGearData } from '../../src/services/gear/descriptive-gear.service'
import { upsertGearVariantData } from '../../src/services/gear/gear-variant.service'
import { upsertGearSpecsData } from '../../src/services/gear/gear-specs.service'
import { upsertGearTagRelationData } from '../../src/services/gear/gear-tag-relation.service'
import { upsertGearFeatureData } from '../../src/services/gear/gear-feature.service'

import { Operator } from '../../src/generated/prisma/enums'
import { SYSTEM_USER_ID } from '../../src/constants/macros'

export async function seedGearDetails() {
    const backpack_type = await findNonArchivedGearTypeByName('Backpack')
    if (!backpack_type) {
        throw new Error('GearType Backpack Bag not found')
    }
    const sleeping_bag_type = await findNonArchivedGearTypeByName('Sleeping Bag')
    if (!sleeping_bag_type) {
        throw new Error('GearType Sleeping Bag not found')
    }
    const sleeping_bag_liner_type =
        await findNonArchivedGearTypeByName('Sleeping Bag Liner')
    if (!sleeping_bag_liner_type) {
        throw new Error('GearType Sleeping Bag Liner not found')
    }
    const pillow_type = await findNonArchivedGearTypeByName('Pillow')
    if (!pillow_type) {
        throw new Error('GearType Pillow not found')
    }
    const tent_type = await findNonArchivedGearTypeByName('Tent')
    if (!tent_type) {
        throw new Error('GearType Tent not found')
    }
    const sleeping_mat_type = await findNonArchivedGearTypeByName('Sleeping Mat')
    if (!sleeping_mat_type) {
        throw new Error('GearType Sleeping Mat not found')
    }
    const sleeping_pad_type = await findNonArchivedGearTypeByName('Sleeping Pad')
    if (!sleeping_pad_type) {
        throw new Error('GearType Sleeping Pad not found')
    }
    const trekking_pack_type = await findNonArchivedGearTypeByName('Trekking Pack')
    if (!trekking_pack_type) {
        throw new Error('GearType Trekking Pack not found')
    }
    const foldable_pack_type = await findNonArchivedGearTypeByName('Foldable Pack')
    if (!foldable_pack_type) {
        throw new Error('GearType Foldable Pack not found')
    }
    const day_pack_type = await findNonArchivedGearTypeByName('Daypack')
    if (!day_pack_type) {
        throw new Error('GearType Daypack not found')
    }
    const hiking_boots_type = await findNonArchivedGearTypeByName('Hiking Boots')
    if (!hiking_boots_type) {
        throw new Error('GearType Hiking Boots not found')
    }

    const osprey_brand = await findNonArchivedBrandByName('Osprey')
    const sea_to_summit_brand = await findNonArchivedBrandByName('Sea To Summit')
    const gregory_brand = await findNonArchivedBrandByName('Gregory')
    const deuter_brand = await findNonArchivedBrandByName('Deuter')
    const naturehike_brand = await findNonArchivedBrandByName('Naturehike')
    const thermarest_brand = await findNonArchivedBrandByName('Therm-A-Rest')

    // gear
    const osprey_hikelite_26 = await upsertGearData(
        'Hikelite 26 Backpack',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        day_pack_type.id,
        osprey_brand?.id
    )
    const osprey_ariel_65 = await upsertGearData(
        'Ariel 65L Hikinh Pack Womens',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        trekking_pack_type.id,
        osprey_brand?.id
    )
    const gregory_maven_48 = await upsertGearData(
        'Maven 48',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        trekking_pack_type.id,
        gregory_brand?.id
    )
    const gregory_deva_60 = await upsertGearData(
        'Deva 60',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        trekking_pack_type.id,
        gregory_brand?.id
    )
    const naturehike_starriver_tent = await upsertGearData(
        'Star River 2-Person Ultralight Backpacking Tent',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        tent_type.id,
        naturehike_brand?.id
    )
    const sts_XR_sleeping_mat = await upsertGearData(
        'XR Insulated Air Sleeping Mat',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        sleeping_mat_type.id,
        sea_to_summit_brand?.id
    )
    const thermarest_sleeping_pad = await upsertGearData(
        'NeoAir XTherm NXT Sleeping Pd',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        sleeping_mat_type.id,
        thermarest_brand?.id
    )
    const sts_ascent_sleeping_bag = await upsertGearData(
        'Ascent Down Sleeping Bag -1',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        sleeping_bag_type.id,
        sea_to_summit_brand?.id
    )
    const sts_reactor_liner = await upsertGearData(
        'Reactor Sleeping Bag Liner',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        sleeping_bag_liner_type.id,
        sea_to_summit_brand?.id
    )
    const sts_areo_pillow = await upsertGearData(
        'Areo Premium Pillow',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        pillow_type.id,
        sea_to_summit_brand?.id
    )
    const deuter_futura_65 = await upsertGearData(
        "Futura Air Trek SL 55+10L Hiking Pack Women's",
        SYSTEM_USER_ID,
        SYSTEM_USER_ID,
        backpack_type.id,
        deuter_brand?.id
    )

    // descriptive gear
    const first_aid_kit = await upsertDescriptiveGearData(
        'First Aid Kit',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID
    )
    const whistle = await upsertDescriptiveGearData(
        'Whistle',
        SYSTEM_USER_ID,
        SYSTEM_USER_ID
    )

    // gear variant
    await upsertGearVariantData(
        sts_ascent_sleeping_bag.id,
        'Regular',
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        sts_areo_pillow.id,
        'Regular',
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        sts_ascent_sleeping_bag.id,
        'Large',
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        sts_ascent_sleeping_bag.id,
        'XLarge',
        SYSTEM_USER_ID,
        true
    )
    const gregory_deva_60_xs = await upsertGearVariantData(
        gregory_deva_60.id,
        'xs',
        SYSTEM_USER_ID,
        true
    )
    const gregory_deva_60_s = await upsertGearVariantData(
        gregory_deva_60.id,
        'sm',
        SYSTEM_USER_ID,
        true
    )
    const gregory_deva_60_m = await upsertGearVariantData(
        gregory_deva_60.id,
        'md',
        SYSTEM_USER_ID,
        true
    )
    await upsertGearVariantData(
        gregory_deva_60.id,
        'Mountain Teal',
        SYSTEM_USER_ID
    )
    await upsertGearVariantData(
        gregory_deva_60.id,
        'Garnet Red',
        SYSTEM_USER_ID
    )

    const osprey_ariel_65_xss = await upsertGearVariantData(
        osprey_ariel_65.id,
        'xs/s',
        SYSTEM_USER_ID,
        true
    )
    const osprey_ariel_65_ml = await upsertGearVariantData(
        osprey_ariel_65.id,
        'm/l',
        SYSTEM_USER_ID,
        true
    )

    const gregory_maven_48_xss = await upsertGearVariantData(
        gregory_maven_48.id,
        'xs/s',
        SYSTEM_USER_ID,
        true
    )
    const gregory_maven_48_sm = await upsertGearVariantData(
        gregory_maven_48.id,
        's/m',
        SYSTEM_USER_ID,
        true
    )

    // gear tag relation
    const waterproof_tag = await findNonArchivedTagByName('Waterproof')
    if (!waterproof_tag) {
        throw new Error('Tag Waterproof not found')
    }
    const sleeping_system_tag = await findNonArchivedTagByName('Sleeping System')
    if (!sleeping_system_tag) {
        throw new Error('Tag Sleeping System not found')
    }
    const ultralight_tag = await findNonArchivedTagByName('Ultralight')
    if (!ultralight_tag) {
        throw new Error('Tag Ultralight not found')
    }
    const multiday_tag = await findNonArchivedTagByName('Multiday')
    if (!multiday_tag) {
        throw new Error('Tag Multiday not found')
    }

    await upsertGearTagRelationData(
        naturehike_starriver_tent.id,
        waterproof_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        naturehike_starriver_tent.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )

    await upsertGearTagRelationData(
        sts_XR_sleeping_mat.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        thermarest_sleeping_pad.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        sts_ascent_sleeping_bag.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        sts_reactor_liner.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        sts_areo_pillow.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )

    await upsertGearTagRelationData(
        sts_XR_sleeping_mat.id,
        ultralight_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        sts_ascent_sleeping_bag.id,
        ultralight_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        sts_reactor_liner.id,
        ultralight_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        thermarest_sleeping_pad.id,
        ultralight_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        sts_areo_pillow.id,
        ultralight_tag.id,
        SYSTEM_USER_ID
    )

    await upsertGearTagRelationData(
        gregory_maven_48.id,
        multiday_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        gregory_deva_60.id,
        multiday_tag.id,
        SYSTEM_USER_ID
    )
    await upsertGearTagRelationData(
        sts_ascent_sleeping_bag.id,
        multiday_tag.id,
        SYSTEM_USER_ID
    )

    // gear specs
    const kilogram_unit = await findNonArchivedUnitByName('Kilogram')
    const pounds_unit = await findNonArchivedUnitByName('Pounds')
    const centimeter_unit = await findNonArchivedUnitByName('Centimeter')
    const liter_unit = await findNonArchivedUnitByName('Liter')
    const inch_unit = await findNonArchivedUnitByName('Inch')

    const backpack_weight_spec_definition =
        await findNonArchivedGearSpecsDefinitionByNameAndType('Weight', backpack_type.id)
    if (!backpack_weight_spec_definition) {
        throw new Error('GearSpecsDefinition Weight-backpack_type not found')
    }
    const backpack_capacity_spec_definition =
        await findNonArchivedGearSpecsDefinitionByNameAndType('Capacity', backpack_type.id)
    if (!backpack_capacity_spec_definition) {
        throw new Error('GearSpecsDefinition Capacity-backpack_type not found')
    }
    const backpack_recommended_load_spec_definition =
        await findNonArchivedGearSpecsDefinitionByNameAndType(
            'Recommended Load',
            backpack_type.id
        )
    if (!backpack_recommended_load_spec_definition) {
        throw new Error(
            'GearSpecsDefinition Recommended Load-backpack_type not found'
        )
    }
    const backpack_torso_length_spec_definition =
        await findNonArchivedGearSpecsDefinitionByNameAndType(
            'Torso Length',
            backpack_type.id
        )
    if (!backpack_torso_length_spec_definition) {
        throw new Error(
            'GearSpecsDefinition Torso Length-backpack_type not found'
        )
    }
    const backpack_back_panel_technology_spec_definition =
        await findNonArchivedGearSpecsDefinitionByNameAndType(
            'Back Panel Technology',
            backpack_type.id
        )
    if (!backpack_back_panel_technology_spec_definition) {
        throw new Error('GearSpecsDefinition Back Panel Technology not found')
    }
    // Gregory Deva 60
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_capacity_spec_definition.id,
        gregory_deva_60_xs.id,
        liter_unit?.id,
        null,
        null,
        55
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_capacity_spec_definition.id,
        gregory_deva_60_s.id,
        liter_unit?.id,
        null,
        null,
        60
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_capacity_spec_definition.id,
        gregory_deva_60_m.id,
        liter_unit?.id,
        null,
        null,
        65
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_weight_spec_definition.id,
        gregory_deva_60_xs.id,
        pounds_unit?.id,
        null,
        null,
        4.6
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_weight_spec_definition.id,
        gregory_deva_60_s.id,
        pounds_unit?.id,
        null,
        null,
        4.64
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_weight_spec_definition.id,
        gregory_deva_60_m.id,
        pounds_unit?.id,
        null,
        null,
        4.96
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_recommended_load_spec_definition.id,
        gregory_deva_60_xs.id,
        pounds_unit?.id,
        null,
        null,
        50,
        null,
        Operator.LESS_THAN
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_recommended_load_spec_definition.id,
        gregory_deva_60_s.id,
        pounds_unit?.id,
        null,
        null,
        50,
        null,
        Operator.LESS_THAN
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_recommended_load_spec_definition.id,
        gregory_deva_60_m.id,
        pounds_unit?.id,
        null,
        null,
        50,
        null,
        Operator.LESS_THAN
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_torso_length_spec_definition.id,
        gregory_deva_60_xs.id,
        inch_unit?.id,
        null,
        null,
        14,
        17,
        Operator.RANGE
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_torso_length_spec_definition.id,
        gregory_deva_60_s.id,
        inch_unit?.id,
        null,
        null,
        15,
        18,
        Operator.RANGE
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_deva_60.id,
        backpack_torso_length_spec_definition.id,
        gregory_deva_60_m.id,
        inch_unit?.id,
        null,
        null,
        16,
        19,
        Operator.RANGE
    )

    // Osprey Ariel 65
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        osprey_ariel_65.id,
        backpack_capacity_spec_definition.id,
        osprey_ariel_65_xss.id,
        liter_unit?.id,
        null,
        null,
        62
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        osprey_ariel_65.id,
        backpack_capacity_spec_definition.id,
        osprey_ariel_65_ml.id,
        liter_unit?.id,
        null,
        null,
        65
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        osprey_ariel_65.id,
        backpack_weight_spec_definition.id,
        osprey_ariel_65_xss.id,
        kilogram_unit?.id,
        null,
        null,
        2.2
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        osprey_ariel_65.id,
        backpack_weight_spec_definition.id,
        osprey_ariel_65_ml.id,
        kilogram_unit?.id,
        null,
        null,
        2.22
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        osprey_ariel_65.id,
        backpack_recommended_load_spec_definition.id,
        osprey_ariel_65_xss.id,
        kilogram_unit?.id,
        null,
        null,
        14,
        27,
        Operator.RANGE
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        osprey_ariel_65.id,
        backpack_recommended_load_spec_definition.id,
        osprey_ariel_65_ml.id,
        kilogram_unit?.id,
        null,
        null,
        14,
        27,
        Operator.RANGE
    )

    // Deuter Futura Air 55+10
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        deuter_futura_65.id,
        backpack_capacity_spec_definition.id,
        null,
        liter_unit?.id,
        null,
        null,
        65
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        deuter_futura_65.id,
        backpack_weight_spec_definition.id,
        null,
        kilogram_unit?.id,
        null,
        null,
        2.1
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        deuter_futura_65.id,
        backpack_recommended_load_spec_definition.id,
        null,
        kilogram_unit?.id,
        null,
        null,
        8,
        15,
        Operator.RANGE
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        deuter_futura_65.id,
        backpack_torso_length_spec_definition.id,
        null,
        centimeter_unit?.id,
        null,
        null,
        35,
        36,
        Operator.RANGE
    )

    // Maven 48
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_capacity_spec_definition.id,
        gregory_maven_48_xss.id,
        liter_unit?.id,
        null,
        null,
        48
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_weight_spec_definition.id,
        gregory_maven_48_xss.id,
        kilogram_unit?.id,
        null,
        null,
        1.42
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_recommended_load_spec_definition.id,
        gregory_maven_48_xss.id,
        kilogram_unit?.id,
        null,
        null,
        23,
        null,
        Operator.LESS_THAN_OR_EQUAL
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_torso_length_spec_definition.id,
        gregory_maven_48_xss.id,
        centimeter_unit?.id,
        null,
        null,
        36,
        43,
        Operator.RANGE
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_capacity_spec_definition.id,
        gregory_maven_48_sm.id,
        liter_unit?.id,
        null,
        null,
        48
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_weight_spec_definition.id,
        gregory_maven_48_sm.id,
        kilogram_unit?.id,
        null,
        null,
        1.45
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_recommended_load_spec_definition.id,
        gregory_maven_48_sm.id,
        kilogram_unit?.id,
        null,
        null,
        23,
        null,
        Operator.LESS_THAN_OR_EQUAL
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_torso_length_spec_definition.id,
        gregory_maven_48_sm.id,
        centimeter_unit?.id,
        null,
        null,
        41,
        51,
        Operator.RANGE
    )
    await upsertGearSpecsData(
        SYSTEM_USER_ID,
        gregory_maven_48.id,
        backpack_back_panel_technology_spec_definition.id,
        null,
        null,
        null,
        'AirCushion mesh backpanel'
    )
    // gear feature
    await upsertGearFeatureData(
        gregory_maven_48.id,
        SYSTEM_USER_ID,
        null,
        null,
        'FreeFloat dynamic hipbelt flex panels that move with the natural movements of your body'
    )
    await upsertGearFeatureData(
        gregory_maven_48.id,
        SYSTEM_USER_ID,
        null,
        null,
        'Front oversized stretch mesh pocket with secure buckle closure'
    )
}
