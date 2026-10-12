import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status, DescribingTargetType } from '../../generated/prisma/enums.js'
import type { Tag, GearTagRelation } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findGearTagRelationById(id: number) {
    return await prisma.gearTagRelation.findUnique({ where: { id: id } })
}

export async function findGearTagRelationByGearAndTagId(
    gear_id: number,
    tag_id: number
) {
    return await prisma.gearTagRelation.findFirst({
        where: {
            gear_id: gear_id,
            tag_id: tag_id,
        },
    })
}

async function isTagApplicableOnGear(tag_id: number) {
    // check whether the desired tag exists
    const tag = await prisma.tag.findUnique({
        where: { id: tag_id },
    })
    if (!tag) {
        // TODO: error handling
        throw new Error('Tag not found')
    }
    if (tag.describe_target_type === DescribingTargetType.TRAIL) {
        // TODO: error handling
        throw new Error(`Tag ${tag.name} can only be applied on Trail object`)
    }
    return true
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_gear_tag_relation: GearTagRelation,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_gear_tag_relation.status) &&
        (notes === undefined || notes === db_gear_tag_relation.notes)
    )
}

export async function upsertGearTagRelationData(
    gear_id: number,
    tag_id: number,
    actor_user_id: number,
    notes?: string | null,
    status?: Status
) {
    // check whether the relation already exists
    const existing_gear_tag_relation = await findGearTagRelationByGearAndTagId(
        gear_id,
        tag_id
    )
    if (existing_gear_tag_relation) {
        if (isInputIdenticalToDb(existing_gear_tag_relation, status, notes))
            return existing_gear_tag_relation

        // update database record witn input value
        return await prisma.gearTagRelation.update({
            where: { id: existing_gear_tag_relation.id },
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
    return await prisma.gearTagRelation.create({
        data: {
            gear_id: gear_id,
            tag_id: tag_id,
            notes: notes,
            status: status ?? Status.ACTIVE,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
        },
    })
}
