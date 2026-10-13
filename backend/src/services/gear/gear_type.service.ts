import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status } from '../../generated/prisma/enums.js'
import type { GearType } from '../../generated/prisma/client.js'
import { findTagByName } from '../common/tag.service.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * **/
export async function findGearTypeById ( id: number ){
    return await prisma.gearType.findUnique({ where: {id: id} })
}

/**
 * **/
export async function findGearTypeByName( name: string ){
    return await prisma.gearType.findUnique({ where: {name: name} })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_gear_type: GearType,
    is_comparable?: boolean,
    status?: Status,
    notes?: string | null
) {
    return (
        (is_comparable === undefined || is_comparable === db_gear_type.is_comparable) && 
        (status === undefined || status === db_gear_type.status) && 
        (notes === undefined || notes === db_gear_type.notes)
        )
}

/**
 * **/
export async function upsertGearTypeData (
    name: string,
    actor_user_id: number,
    is_comparable?: boolean,
    status?: Status,
    notes?: string | null
) {
    // check whether the gear type with given name already exists in the database
    const existing_gear_type = await findGearTypeByName(name)
    if(existing_gear_type) {
        // check whether the input is identical to database data
        if (isInputIdenticalToDb(existing_gear_type, is_comparable, status, notes)) return existing_gear_type
        // update database record with input value
        return await prisma.gearType.update({
            where: { id: existing_gear_type.id },
            data: {
                updated_by_id: actor_user_id,
                ...(is_comparable !== undefined && {
                    is_comparable: is_comparable
                }),
                ...(status !== undefined && {
                    status: status
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            },
        })
    }
        // create new gear type entry if the type with given name doesn't exist in the db
        return await prisma.gearType.create({
            data: {
                name: name,
                created_by_id: actor_user_id,
                updated_by_id: actor_user_id,
                is_comparable: is_comparable ?? true,
                status: status ?? Status.ACTIVE,
                notes: notes
            }
        })
}


/**
 * **/
export async function createGearTypeData(
    name: string,
    actor_user_id: number,
    is_comparable?: boolean,
    status?: Status,
    notes?: string | null
) {
    return await prisma.gearType.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            is_comparable: is_comparable ?? true,
            status: status ?? Status.ACTIVE,
            notes: notes
        }
    })
}