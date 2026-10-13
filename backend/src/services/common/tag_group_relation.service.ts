import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status } from '../../generated/prisma/enums.js'
import type { TagGroupRelation } from '../../generated/prisma/client.js'
import { stat } from 'node:fs'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findTagGroupRelationById( id: number ){
    return await prisma.tagGroupRelation.findUnique({ where: { id: id }})
}
export async function findTagGroupRelationByFks(
    tag_group_id: number,
    tag_id: number
) {
    return await prisma.tagGroupRelation.findFirst({
        where: {
            tag_group_id: tag_group_id,
            tag_id: tag_id
        }
    })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database tag group-tag data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_tag_group_relation: TagGroupRelation,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_tag_group_relation.status) && 
        (notes === undefined || notes === db_tag_group_relation.notes)
        )
}

export async function upsertTagGroupRelationData(
    tag_group_id: number,
    tag_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // check whether the tag group - ag relation already exists in the database
    const existing_tag_group_relation = await findTagGroupRelationByFks(tag_group_id, tag_id)
    if (existing_tag_group_relation) {
        // check whether the input is identical to database tag group-tag data
        if (isInputIdenticalToDb(existing_tag_group_relation, status, notes)) return existing_tag_group_relation
        // update database record with input value
        return await prisma.tagGroupRelation.update({
            where: { id: existing_tag_group_relation.id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== null && {
                    status: status,
                }),
                ...(notes !== undefined && {
                    notes: notes,
                }),
            }
        })
    }
    // create new tag group-tag relation record
    return await prisma.tagGroupRelation.create({
        data: {
            tag_group_id: tag_group_id,
            tag_id: tag_id,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes
        }
    })
}