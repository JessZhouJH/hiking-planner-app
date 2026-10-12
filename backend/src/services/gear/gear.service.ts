import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status, Visibility, ProductionStatus } from '../../generated/prisma/enums.js'
import type { Gear } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg( pool )
const prisma = new PrismaClient({ adapter })

export async function findGearById( id: number ){
    return await prisma.gear.findUnique( {where: { id: id} })
}

export async function findGearByNameAndOwner (
    name: string,
    owner_id: number
) {
    return await prisma.gear.findFirst({
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
    db_gear: Gear,
    gear_type_id: number,
    brand_id?: number | null,
    preview_img_key?: string | null,
    visibility?: Visibility,
    production_status?: ProductionStatus,
    status?: Status,
    notes?: string | null
) {
    return (
        (gear_type_id === undefined || gear_type_id === db_gear.gear_type_id) && 
        (brand_id === undefined || brand_id === db_gear.brand_id) && 
        (preview_img_key === undefined || preview_img_key === db_gear.preview_img_key) && 
        (visibility === undefined || visibility === db_gear.visibility) && 
        (production_status === undefined || production_status === db_gear.production_status) && 
        (status === undefined || status === db_gear.status) && 
        (notes === undefined || notes === db_gear.notes)
        )
}

export async function upsertGearData(
    name: string,
    actor_user_id: number,
    owner_id: number,
    gear_type_id: number,
    brand_id?: number | null,
    preview_img_key?: string | null,
    visibility?: Visibility,
    production_status?: ProductionStatus,
    status?: Status,
    notes?: string | null
) { 
    // check whether the gear with given name already exists in the database
    const existing_gear = await findGearByNameAndOwner(name, owner_id)
    if (existing_gear) {
        
        // check whether the input is identical to database data
        if(isInputIdenticalToDb(existing_gear, gear_type_id, brand_id, preview_img_key, visibility, production_status, status, notes)) return existing_gear

        // update database record with input value
        return await prisma.gear.update({
            where: { id: existing_gear.id },
            data:{
                updated_by_id: actor_user_id,
                gear_type_id: gear_type_id, 
                ...(brand_id !== undefined && {
                    brand_id: brand_id
                }), 
                ...(preview_img_key !== undefined && {
                    preview_img_key: preview_img_key
                }), 
                ...(visibility !== undefined && {
                    visibility: visibility
                }), 
                ...(production_status !== undefined && {
                    production_status: production_status
                }), 
                ...(status !== undefined && {
                    status: status
                }), 
                ...(notes !== undefined && {
                    notes: notes
                })
            }
        })

    }
    // create new record
    return await prisma.gear.create({
        data: {
            name: name,
            owner_id: owner_id,
            gear_type_id: gear_type_id, 
            brand_id: brand_id ?? null, 
            preview_img_key: preview_img_key ?? null, 
            visibility: visibility ?? Visibility.UNSPECIFIED, 
            production_status: production_status ?? ProductionStatus.UNSPECIFIED, 
            status: status ?? Status.ACTIVE, 
            notes: notes ?? null,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id
        }
    })
}