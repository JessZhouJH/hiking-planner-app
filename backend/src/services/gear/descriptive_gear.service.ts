import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status, Visibility } from '../../generated/prisma/enums.js'
import type { DescriptiveGear } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg( pool )
const prisma = new PrismaClient({ adapter })

export async function findDescriptiveGearById( id: number ){
    return await prisma.descriptiveGear.findUnique({ where: { id: id} })
}

export async function findDescriptiveGearByName( name: string ){
    return await prisma.descriptiveGear.findUnique({ where: { name: name } })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_descriptive_gear: DescriptiveGear,
    preview_img_key?: string | null,
    visibility?: Visibility,
    status?: Status,
    notes?: string | null
) {
    return (
        (preview_img_key === undefined || preview_img_key === db_descriptive_gear.preview_img_key) && 
        (visibility === undefined || visibility === db_descriptive_gear.visibility) && 
        (status === undefined || status === db_descriptive_gear.status) && 
        (notes === undefined || notes === db_descriptive_gear.notes)
        )
}

export async function upsertDescriptiveGearData(
    name: string,
    owner_id: number,
    actor_user_id: number,
    preview_img_key?: string | null,
    visibility?: Visibility,
    status?: Status,
    notes?: string | null
){
    // check whether the descriptive gear already exist in the database
    const existing_descriptive_gear = await findDescriptiveGearByName(name)

    if (existing_descriptive_gear) {
        // check whether the input is identical to database
        if ( isInputIdenticalToDb (existing_descriptive_gear, preview_img_key, visibility, status, notes)) return existing_descriptive_gear

        // update database record with input value
        return await prisma.descriptiveGear.update({
            where: { id: existing_descriptive_gear.id},
            data: {
                updated_by_id: actor_user_id,
                ...(preview_img_key !== undefined && {
                    preview_img_key: preview_img_key
                }), 
                ...(visibility !== undefined && {
                    visibility: visibility}), 
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
    return await prisma.descriptiveGear.create({
        data: {
            name: name,
            owner_id: owner_id,
            preview_img_key: preview_img_key ?? null,
            visibility: visibility ?? Visibility.UNSPECIFIED,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id
        }
    })
}
