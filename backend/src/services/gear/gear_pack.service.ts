import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status, Visibility } from '../../generated/prisma/enums.js'
import type { GearPack } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findGearPackById( id: number ){
    return await prisma.gearPack.findUnique( {where: {id: id} } )
}

export async function findGearPackByName( name: string ){
    return await prisma.gearPack.findMany({ where: { name: name }})
}

export async function findGearPackByNameAndOwner(
    name: string,
    owner_id: number
) {
    return prisma.gearPack.findFirst({
        where: {
            name: name, 
            owner_id: owner_id
        }
    })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_gear_pack: GearPack,
    is_universal?: boolean,
    derived_from_gear_pack_id?: number | null,
    visibility?: Visibility,
    status?: Status,
    notes?: string | null
) {
    return (
        (is_universal === undefined || is_universal === db_gear_pack.is_universal) && 
        (derived_from_gear_pack_id === undefined || derived_from_gear_pack_id === db_gear_pack.derived_from_gear_pack_id) && 
        (visibility === undefined || visibility === db_gear_pack.visibility) && 
        (status === undefined || status === db_gear_pack.status) && 
        (notes === undefined || notes === db_gear_pack.notes)
        )
}

export async function upsertGearPackData(
    name: string,
    owner_id: number,
    actor_user_id: number,
    is_universal?: boolean,
    visibility?: Visibility,
    derived_from_gear_pack_id?: number | null,
    status?: Status,
    notes?: string | null
) {
    // check whether the owner with given id already has such named gear pack in the database
    const existing_gear_pack = await findGearPackByNameAndOwner( name, owner_id)

    if (existing_gear_pack) {
        // check whether the input is identical to database data
        if (isInputIdenticalToDb(
            existing_gear_pack,
            is_universal,
            derived_from_gear_pack_id,
            visibility,
            status,
            notes
        )) return existing_gear_pack

        // update database record with input value
        return await prisma.gearPack.update({
            where: { id: existing_gear_pack.id },
            data: {
                updated_by_id: actor_user_id,
                ...(is_universal !== undefined && {
                    is_universal: is_universal
                }),
                ...(derived_from_gear_pack_id !== undefined && {
                    derived_from_gear_pack_id: derived_from_gear_pack_id
                }),
                ...(visibility !== undefined && {
                    visibility: visibility
                }),
                ...(status !== undefined && {
                    status: status
                }),
                ...( notes !== undefined && {
                    notes: notes
                })
            }
        })
    }
    // create new gear pack record
    return await prisma.gearPack.create({
        data: {
            name: name,
            is_universal: is_universal ?? false,
            derived_from_gear_pack_id: derived_from_gear_pack_id,
            owner_id: owner_id,
            visibility: visibility ?? Visibility.UNSPECIFIED,
            notes: notes,
            status: status ?? Status.ACTIVE,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id
        }
    })
}