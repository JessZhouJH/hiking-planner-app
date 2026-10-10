import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status } from '../../generated/prisma/enums.js'
import type { GearTypeRelation } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * **/
export async function findGearTypeRelationById( id: number ){
    return await prisma.gearTypeRelation.findUnique({ where: {id: id} })
}

/**
 * **/
export async function findGearTypeRelationByFks(
    parent_gear_type_id: number,
    child_gear_type_id: number,
) {
    return await prisma.gearTypeRelation.findFirst({
        where: {
            parent_gear_type_id: parent_gear_type_id,
            child_gear_type_id: child_gear_type_id,
                status: Status.ACTIVE
        }
    })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database parent-child gear type relation data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_gear_type_relation: GearTypeRelation,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_gear_type_relation.status) && 
        (notes === undefined || notes === db_gear_type_relation.notes)
        )
}

export async function upsertGearTypeRelationData(
    parent_gear_type_id: number,
    child_gear_type_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // check whether the target relation exists in the database already
    const existing_gear_type_relation = await findGearTypeRelationByFks(parent_gear_type_id, child_gear_type_id)
    if (existing_gear_type_relation) {
        // check whether the input is identical to database parent-child gear type relation data
        if (isInputIdenticalToDb(existing_gear_type_relation, status, notes)) return existing_gear_type_relation
        // update record with given data is existed already
        return await prisma.gearTypeRelation.update({
            where: { id: existing_gear_type_relation.id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== undefined && {
                    status: status
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            }
    })}
    // create new gear type relation record
    return await prisma.gearTypeRelation.create({
        data: {
            parent_gear_type_id: parent_gear_type_id,
            child_gear_type_id: child_gear_type_id,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes
        }
    })
}