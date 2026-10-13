import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'
import type { TagRelation } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findTagRelationById(id: number) {
    return await prisma.tagRelation.findUnique({ where: { id: id } })
}
export async function findTagRelationByFks(
    parent_tag_id: number,
    child_tag_id: number
) {
    return await prisma.tagRelation.findFirst({
        where: {
            parent_tag_id: parent_tag_id,
            child_tag_id: child_tag_id,
            status: Status.ACTIVE,
        },
    })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database parent-child tag relation data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_tag_relation: TagRelation,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_tag_relation.status) && 
        (notes === undefined || notes === db_tag_relation.notes)
        )
}

export async function upsertTagRelationData(
    parent_tag_id: number,
    child_tag_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    const exisiting_tag_relation = await findTagRelationByFks(
        parent_tag_id,
        child_tag_id
    )
    if (exisiting_tag_relation){
        // check whether the input is identical to database parent-child tag relation data
        if (isInputIdenticalToDb(exisiting_tag_relation, status, notes)) return exisiting_tag_relation
        // update database record with input value 
        return await prisma.tagRelation.update({
            where: { id: exisiting_tag_relation.id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== null && {
                    status: status,
                }),
                ...(notes !== undefined && {
                    notes: notes,
                }),
            },
        })
    }
    // create new tag relation record
    return await prisma.tagRelation.create({
        data: {
            parent_tag_id: parent_tag_id,
            child_tag_id: child_tag_id,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes,
        },
    })
}
