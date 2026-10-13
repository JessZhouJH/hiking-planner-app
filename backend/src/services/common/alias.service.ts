import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status, AliasTargetType } from '../../generated/prisma/enums.js'
import type { Alias } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findAliasByTypeAndIdAndName (
    target_object_type: AliasTargetType,
    target_object_id: number,
    alias: string
) {
    return prisma.alias.findFirst({
        where: {
            target_object_type: target_object_type,
            target_object_id: target_object_id,
            alias: alias
        }
    })
}

export async function findAliasById ( id: number ){
    return await prisma.alias.findUnique({where: {id: id} })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database alias data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_alias: Alias,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_alias.status) && 
        (notes === undefined || notes === db_alias.notes)
        )
}

export async function upsertAliasData (
    target_object_type: AliasTargetType,
    target_object_id: number,
    alias: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // check whether the target object already has an alias that identical to input value
    const existing_alias = await findAliasByTypeAndIdAndName(
        target_object_type,
        target_object_id,
        alias
    )
    if (existing_alias) {
        // check whether the existed data is identical to input
        if (isInputIdenticalToDb(existing_alias, status, notes)) return existing_alias
        // update database record with input value
        return await prisma.alias.update({
            where: { id: existing_alias.id },
            data:{
                updated_by_id: actor_user_id,
                ...(status !== undefined && {
                    status: status
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            }
        })
    }
    // create new alias 
    return await prisma.alias.create({
        data:{
            target_object_type: target_object_type,
            target_object_id: target_object_id,
            alias: alias,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes
        }
    })
}