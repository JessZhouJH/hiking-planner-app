import { prisma } from './seed-client'
import {
    Status,
    UnitCategory,
    DescribingTargetType,
    AliasTargetType,
} from '../../src/generated/prisma/enums'

import { SYSTEM_USER_ID } from '../../src/constants/macros'
import { upsertUnitData } from '../../src/services/common/unit.service'
import { upsertTagData } from '../../src/services/common/tag.service'
import { upsertTagGroupData } from '../../src/services/common/tag_group.service'
import { upsertTagRelationData } from '../../src/services/common/tag_relation.service'
import { upsertTagGroupRelationData } from '../../src/services/common/tag_group_relation.service'
import { upsertAliasData } from '../../src/services/common/alias.service'

export async function seedCommon() {
    // Alias
    const sea_to_summit_brand = await prisma.brand.findFirst({
        where: { name: 'Sea To Summit' },
    })
    if (sea_to_summit_brand) {
        await upsertAliasData(
            AliasTargetType.BRAND,
            sea_to_summit_brand.id,
            'sea to summit',
            SYSTEM_USER_ID
        )
        await upsertAliasData(
            AliasTargetType.BRAND,
            sea_to_summit_brand.id,
            'sts',
            SYSTEM_USER_ID
        )
        await upsertAliasData(
            AliasTargetType.BRAND,
            sea_to_summit_brand.id,
            'STS',
            SYSTEM_USER_ID
        )
    }

    // MediaArchive

    // Attachment

    // Unit
    await upsertUnitData('Kilogram', UnitCategory.WEIGHT, SYSTEM_USER_ID, 'kg')
    await upsertUnitData('Gram', UnitCategory.WEIGHT, SYSTEM_USER_ID, 'g')
    await upsertUnitData(
        'Celsius',
        UnitCategory.TEMPERATURE,
        SYSTEM_USER_ID,
        '℃'
    )
    await upsertUnitData(
        'Fahrenheit',
        UnitCategory.TEMPERATURE,
        SYSTEM_USER_ID,
        '℉'
    )
    await upsertUnitData('Kilometer', UnitCategory.LENGTH, SYSTEM_USER_ID, 'km')
    await upsertUnitData('Meter', UnitCategory.LENGTH, SYSTEM_USER_ID, ',m')
    await upsertUnitData(
        'Centimeter',
        UnitCategory.LENGTH,
        SYSTEM_USER_ID,
        'cm'
    )
    await upsertUnitData(
        'Millimeter',
        UnitCategory.LENGTH,
        SYSTEM_USER_ID,
        'mm'
    )
    await upsertUnitData('Liter', UnitCategory.VOLUME, SYSTEM_USER_ID, 'L')
    await upsertUnitData(
        'Milliliter',
        UnitCategory.VOLUME,
        SYSTEM_USER_ID,
        'ml'
    )
    await upsertUnitData(
        'Square Meter',
        UnitCategory.AREA,
        SYSTEM_USER_ID,
        '㎡'
    )
    await upsertUnitData(
        'Lumen',
        UnitCategory.LUMINOUS_FLUX,
        SYSTEM_USER_ID,
        'lumen'
    )
    await upsertUnitData('Hour', UnitCategory.DURATION, SYSTEM_USER_ID, 'hrs')
    await upsertUnitData(
        'Minutes',
        UnitCategory.DURATION,
        SYSTEM_USER_ID,
        'mins'
    )

    // Tag
    const alpine_tag = await upsertTagData('Alpine', SYSTEM_USER_ID)
    const trail_running_tag = await upsertTagData(
        'Trail Running',
        SYSTEM_USER_ID
    )
    const multiday_tag = await upsertTagData('Multiday', SYSTEM_USER_ID)
    const ultralight_tag = await upsertTagData(
        'Ultralight',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const technical_tag = await upsertTagData('Technical', SYSTEM_USER_ID)
    const wet_weather_tag = await upsertTagData('Wet Weather', SYSTEM_USER_ID)
    const cold_weather_tag = await upsertTagData('Cold Weather', SYSTEM_USER_ID)
    const waterproof_tag = await upsertTagData(
        'Waterproof',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const sleeping_system_tag = await upsertTagData(
        'Sleeping System',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const hydration_tag = await upsertTagData(
        'Hydration',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const hiking_boots_tag = await upsertTagData(
        'Hiking Boots',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const hiking_shoes_tag = await upsertTagData(
        'Hiking Shoes',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const trail_running_shoes_tag = await upsertTagData(
        'Trail Running Shoes',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const extended_fit_tag = await upsertTagData(
        'Extended Fit',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const remote_tag = await upsertTagData(
        'Remote',
        SYSTEM_USER_ID,
        DescribingTargetType.TRAIL
    )

    // TagGroup
    const terrain_tag_group = await upsertTagGroupData(
        'Terrain',
        SYSTEM_USER_ID
    )
    const activity_tag_group = await upsertTagGroupData(
        'Activity',
        SYSTEM_USER_ID
    )
    const techinical_use_tag_group = await upsertTagGroupData(
        'Technical Use',
        SYSTEM_USER_ID
    )
    const footwear_tag_group = await upsertTagGroupData(
        'Footwear',
        SYSTEM_USER_ID
    )
    const gear_system_tag_group = await upsertTagGroupData(
        'Gear System',
        SYSTEM_USER_ID
    )
    const gear_characteristics_tag_group = await upsertTagGroupData(
        'Gear Characteristics',
        SYSTEM_USER_ID
    )

    // TagRelation
    await upsertTagRelationData(
        trail_running_tag.id,
        trail_running_shoes_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagRelationData(
        wet_weather_tag.id,
        waterproof_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagRelationData(
        multiday_tag.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagRelationData(alpine_tag.id, technical_tag.id, SYSTEM_USER_ID)

    // TagGroupRelation
    await upsertTagGroupRelationData(
        terrain_tag_group.id,
        alpine_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        activity_tag_group.id,
        trail_running_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        activity_tag_group.id,
        multiday_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        techinical_use_tag_group.id,
        alpine_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        techinical_use_tag_group.id,
        technical_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        techinical_use_tag_group.id,
        trail_running_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        footwear_tag_group.id,
        hiking_boots_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        footwear_tag_group.id,
        hiking_shoes_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        footwear_tag_group.id,
        trail_running_shoes_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        gear_system_tag_group.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        gear_system_tag_group.id,
        hydration_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        gear_characteristics_tag_group.id,
        ultralight_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        gear_characteristics_tag_group.id,
        waterproof_tag.id,
        SYSTEM_USER_ID
    )
    await upsertTagGroupRelationData(
        gear_characteristics_tag_group.id,
        extended_fit_tag.id,
        SYSTEM_USER_ID
    )
}
