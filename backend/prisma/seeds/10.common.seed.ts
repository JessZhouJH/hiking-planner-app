import { prisma } from './seed-client'
import {
    Status,
    UnitCategory,
    DescribingTargetType,
} from '../../src/generated/prisma/enums'

import { SYSTEM_USER_ID } from '../../src/constants/macros'

export async function seedCommon() {
    // Alias

    // MediaArchive

    // Attachment

    // Unit
    async function createUnit(
        name: string,
        display_name: string,
        category: UnitCategory,
        user_id: number
    ) {
        const existing_unit = await prisma.unit.findFirst({
            where: { name: name },
        })
        if (existing_unit) {
            await prisma.unit.update({
                where: { id: existing_unit.id },
                data: {
                    name: name,
                    display_name: display_name,
                    category: category,
                    updated_by_id: user_id,
                },
            })
        } else {
            await prisma.unit.create({
                data: {
                    name: name,
                    display_name: display_name,
                    category: category,
                    created_by_id: user_id,
                    updated_by_id: user_id,
                },
            })
        }
    }

    await createUnit('Kilogram', 'kg', UnitCategory.WEIGHT, SYSTEM_USER_ID)
    await createUnit('Gram', 'g', UnitCategory.WEIGHT, SYSTEM_USER_ID)
    await createUnit('Celsius', '℃', UnitCategory.TEMPERATURE, SYSTEM_USER_ID)
    await createUnit(
        'Fahrenheit',
        '℉',
        UnitCategory.TEMPERATURE,
        SYSTEM_USER_ID
    )
    await createUnit('Kilometer', 'km', UnitCategory.LENGTH, SYSTEM_USER_ID)
    await createUnit(' Meter', ',m', UnitCategory.LENGTH, SYSTEM_USER_ID)
    await createUnit('Centimeter', 'cm', UnitCategory.LENGTH, SYSTEM_USER_ID)

    // Tag
    async function createTag(
        name: string,
        user_id: number,
        describing_target_type?: DescribingTargetType
    ) {
        const new_tag = await prisma.tag.upsert({
            where: { name: name },
            update: {},
            create: {
                name: name,
                created_by_id: user_id,
                updated_by_id: user_id,
                describe_target_type: describing_target_type
                    ? describing_target_type
                    : DescribingTargetType.GEAR_AND_TRAIL,
            },
        })
        return new_tag
    }
    const alpine_tag = await createTag('Alpine', SYSTEM_USER_ID)
    const trail_running_tag = await createTag('Trail Running', SYSTEM_USER_ID)
    const multiday_tag = await createTag('Multiday', SYSTEM_USER_ID)
    const ultralight_tag = await createTag(
        'Ultralight',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const technical_tag = await createTag('Technical', SYSTEM_USER_ID)
    const wet_weather_tag = await createTag('Wet Weather', SYSTEM_USER_ID)
    const cold_weather_tag = await createTag('Cold Weather', SYSTEM_USER_ID)
    const waterproof_tag = await createTag(
        'Waterproof',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const sleeping_system_tag = await createTag(
        'Sleeping System',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const hydration_tag = await createTag(
        'Hydration',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const hiking_boots_tag = await createTag(
        'Hiking Boots',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const hiking_shoes_tag = await createTag(
        'Hiking Shoes',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const trail_running_shoes_tag = await createTag(
        'Trail Running Shoes',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const extended_fit_tag = await createTag(
        'Extended Fit',
        SYSTEM_USER_ID,
        DescribingTargetType.GEAR
    )
    const remote_tag = await createTag(
        'Remote',
        SYSTEM_USER_ID,
        DescribingTargetType.TRAIL
    )

    // TagGroup
    async function createTagGroup(name: string, user_id: number) {
        const new_tag_group = await prisma.tagGroup.upsert({
            where: { name: name },
            update: {},
            create: {
                name: name,
                created_by_id: user_id,
                updated_by_id: user_id,
            },
        })
        return new_tag_group
    }
    const terrain_tag_group = await createTagGroup('Terrain', SYSTEM_USER_ID)
    const activity_tag_group = await createTagGroup('Activity', SYSTEM_USER_ID)
    const techinical_use_tag_group = await createTagGroup(
        'Technical Use',
        SYSTEM_USER_ID
    )
    const footwear_tag_group = await createTagGroup('Footwear', SYSTEM_USER_ID)
    const gear_system_tag_group = await createTagGroup(
        'Gear System',
        SYSTEM_USER_ID
    )
    const gear_characteristics_tag_group = await createTagGroup(
        'Gear Characteristics',
        SYSTEM_USER_ID
    )

    // TagRelation
    async function createTagRelation(
        parent_tag_id: number,
        child_tag_id: number,
        user_id: number
    ) {
        const existing_tag_relation = await prisma.tagRelation.findFirst({
            where: {
                parent_tag_id: parent_tag_id,
                child_tag_id: child_tag_id,
                status: Status.ACTIVE,
            },
        })
        if (existing_tag_relation) return existing_tag_relation
        const new_tag_relation = await prisma.tagRelation.create({
            data: {
                parent_tag_id: parent_tag_id,
                child_tag_id: child_tag_id,
                created_by_id: user_id,
                updated_by_id: user_id,
            },
        })
        return new_tag_relation
    }
    await createTagRelation(
        trail_running_tag.id,
        trail_running_shoes_tag.id,
        SYSTEM_USER_ID
    )
    await createTagRelation(
        wet_weather_tag.id,
        waterproof_tag.id,
        SYSTEM_USER_ID
    )
    await createTagRelation(
        multiday_tag.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )
    await createTagRelation(alpine_tag.id, technical_tag.id, SYSTEM_USER_ID)

    // TagGroupRelation
    async function createTagGroupRelation(
        tag_group_id: number,
        tag_id: number,
        user_id: number
    ) {
        const existing_tag_group_relation =
            await prisma.tagGroupRelation.findFirst({
                where: {
                    tag_group_id: tag_group_id,
                    tag_id: tag_id,
                    status: Status.ACTIVE,
                },
            })
        if (existing_tag_group_relation) return existing_tag_group_relation
        const new_tag_group_relation = await prisma.tagGroupRelation.create({
            data: {
                tag_group_id: tag_group_id,
                tag_id: tag_id,
                created_by_id: user_id,
                updated_by_id: user_id,
            },
        })
        return new_tag_group_relation
    }
    await createTagGroupRelation(
        terrain_tag_group.id,
        alpine_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        activity_tag_group.id,
        trail_running_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        activity_tag_group.id,
        multiday_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        techinical_use_tag_group.id,
        alpine_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        techinical_use_tag_group.id,
        technical_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        techinical_use_tag_group.id,
        trail_running_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        footwear_tag_group.id,
        hiking_boots_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        footwear_tag_group.id,
        hiking_shoes_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        footwear_tag_group.id,
        trail_running_shoes_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        gear_system_tag_group.id,
        sleeping_system_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        gear_system_tag_group.id,
        hydration_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        gear_characteristics_tag_group.id,
        ultralight_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        gear_characteristics_tag_group.id,
        waterproof_tag.id,
        SYSTEM_USER_ID
    )
    await createTagGroupRelation(
        gear_characteristics_tag_group.id,
        extended_fit_tag.id,
        SYSTEM_USER_ID
    )
}
