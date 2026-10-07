import { prisma } from './seed-client'
import {
    Status,
    UnitCategory,
    DescribingTargetType,
    AliasTargetType
} from '../../src/generated/prisma/enums'

import { SYSTEM_USER_ID } from '../../src/constants/macros'
import { AliasScalarFieldEnum } from '../../src/generated/prisma/internal/prismaNamespace'


export async function seedCommon() {
    // Alias
    async function findExistingTargetTypeObject(
        target_object_type: AliasTargetType,
        target_object_id: number,
    ) { 
        switch(target_object_type) {
            case AliasTargetType.BRAND:
                return await prisma.brand.findUnique({
                    where: { id: target_object_id }
                })
            case AliasTargetType.GEAR:
                return await prisma.gear.findUnique({
                    where: { id: target_object_id }
                })
            case AliasTargetType.TRAIL:
                return await prisma.trail.findUnique({
                    where: { id: target_object_id }
                })
            case AliasTargetType.ACCESS_POINT:
                return await prisma.accessPoint.findUnique({
                    where: { id: target_object_id }
                })
            case AliasTargetType.DESCRIPTIVE_GEAR:
                return await prisma.descriptiveGear.findUnique({
                    where: { id: target_object_id }
                })
            default:
                return null
        }
    }

    async function findExistingAlias (
        target_object_type: AliasTargetType,
        target_object_id: number,
        alias: string
    ) {
        return await prisma.alias.findFirst({
            where: {
                target_object_type: target_object_type,
                target_object_id: target_object_id,
                alias: alias,
            }
        })
    }

    async function createAlias(
        target_object_type: AliasTargetType,
        target_object_id: number,
        alias: string,
        user_id: number
    ) {
        const existing_target_object = await findExistingTargetTypeObject(target_object_type, target_object_id)
        const existing_alias = existing_target_object
            ? await findExistingAlias(target_object_type, target_object_id, alias)
            : null
        if (existing_alias) return existing_alias
        return await prisma.alias.create({
            data: {
                target_object_type: target_object_type,
                target_object_id: target_object_id,
                alias: alias,
                created_by_id: user_id,
                updated_by_id: user_id
            }
        })
    }

    const sea_to_summit_brand = await prisma.brand.findFirst({
        where: { name: "Sea To Summit" }
    })
    if (sea_to_summit_brand) {
        await createAlias(AliasTargetType.BRAND, sea_to_summit_brand.id, "sea to summit", SYSTEM_USER_ID)
        await createAlias(AliasTargetType.BRAND, sea_to_summit_brand.id, "sts", SYSTEM_USER_ID)
        await createAlias(AliasTargetType.BRAND, sea_to_summit_brand.id, "STS", SYSTEM_USER_ID)
    }

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
    await createUnit('Millimeter', 'mm', UnitCategory.LENGTH, SYSTEM_USER_ID)
    await createUnit('Liter', "L", UnitCategory.VOLUME, SYSTEM_USER_ID)
    await createUnit('Milliliter', "ml", UnitCategory.VOLUME, SYSTEM_USER_ID)
    await createUnit('Square Meter', "㎡", UnitCategory.AREA, SYSTEM_USER_ID)
    await createUnit('Lumen', "lumen", UnitCategory.LUMINOUS_FLUX, SYSTEM_USER_ID)
    await createUnit('Hour', "hrs", UnitCategory.DURATION, SYSTEM_USER_ID)
    await createUnit('Minutes', "mins", UnitCategory.DURATION, SYSTEM_USER_ID)

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
