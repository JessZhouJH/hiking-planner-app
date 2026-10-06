import { prisma } from './seed-client'
import { Status, UnitCategory } from '../../src/generated/prisma/enums'

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

    // Tag

    // TagGroup

    // TagRelation

    // TagGroupRelation
}
