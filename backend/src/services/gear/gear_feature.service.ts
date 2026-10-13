import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status } from '../../generated/prisma/enums.js'
import { GearFeature } from '../../generated/prisma/client.js'
import { SYSTEM_USER_ID } from '../../constants/macros.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findGearFeatureById(id: number) {
    return await prisma.gearFeature.findUnique({ where: { id: id } })
}

/**
 * findGearFeatureByFksAndTitleDescription()
 * Helper function to locate Gear Specs by
 * - gear_id, gear_variant_id, title, description
 * only used during data seeding as title and description for a gear specs are considered immutable during seeding stage **/
export async function findGearFeatureByFksAndTitleDescription(
    gear_id: number,
    gear_variant_id?: number | null,
    name?: string | null,
    description?: string | null
) {
    return await prisma.gearFeature.findFirst({
        where: {
            gear_id: gear_id,
            gear_variant_id: gear_variant_id,
            name: name,
            description: description,
        },
    })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_gear_features: GearFeature,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_gear_features.status) &&
        (notes === undefined || notes === db_gear_features.notes)
    )
}

export async function upsertGearFeatureData(
    gear_id: number,
    actor_user_id: number,
    gear_variant_id?: number | null,
    name?: string | null,
    description?: string | null,
    notes?: string | null,
    status?: Status
) {
    // check whether the target exists already
    const existing_gear_feature = await findGearFeatureByFksAndTitleDescription(
        gear_id,
        gear_variant_id,
        name,
        description
    )

    if (existing_gear_feature) {
        // check whether the input is identical to databbase
        if (isInputIdenticalToDb(existing_gear_feature, status, notes))
            return existing_gear_feature

        // update exisitng data with input value
        return await prisma.gearFeature.update({
            where: { id: existing_gear_feature.id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== undefined && {
                    status: status,
                }),
                ...(notes !== undefined && {
                    notes: notes,
                }),
            },
        })
    }

    // create new record
    return await prisma.gearFeature.create({
        data: {
            gear_id: gear_id,
            gear_variant_id: gear_variant_id,
            name: name,
            description: description,
            notes: notes,
            status: status ?? Status.ACTIVE,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
}
