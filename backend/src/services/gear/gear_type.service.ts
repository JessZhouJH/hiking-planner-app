import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status } from '../../generated/prisma/enums.js'
import { is } from 'zod/locales'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * **/
export async function upsertGearTypeData (
    name: string,
    actor_user_id: number,
    is_comparable?: boolean,
    status?: Status,
    notes?: string | null
) {
    return await prisma.gearType.upsert({
        where: { name: name },
        // if the gear type record exist already, update the record with given data
        update: {
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
        // create new gear type entry if the type with given name doesn't exist in the db
        create: {
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
export async function findGearTypeById ( id: number ){
    return await prisma.gearType.findUnique({ where: {id: id} })
}

/**
 * **/
export async function findGearTypeByName( name: string ){
    return await prisma.gearType.findUnique({ where: {name: name} })
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