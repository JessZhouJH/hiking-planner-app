import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status } from '../../generated/prisma/enums.js'
import type { GearVariant } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg( pool )
const prisma = new PrismaClient({ adapter })

export async function findGearVariantById ( id: number ){
    return await prisma.gearVariant.findUnique({ where: {id: id} })
}

export async function findGearVariantByGearAndVariantName (
    gear_id: number,
    gear_variant_name: string
) {
    return await prisma.gearVariant.findFirst({
        where: {
            gear_id: gear_id,
            gear_variant_name: gear_variant_name
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
    db_gear_variant: GearVariant,
    is_technical_variant?: boolean,
    variant_preview_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    return (
        (is_technical_variant === undefined || is_technical_variant === db_gear_variant.is_technical_variant) &&
        (variant_preview_img_key === undefined || variant_preview_img_key === db_gear_variant.variant_preview_img_key) && 
        (status === undefined || status === db_gear_variant.status) && 
        (notes === undefined || notes === db_gear_variant.notes)
        )
}

export async function upsertGearVariantData (
    gear_id: number,
    gear_variant_name: string,
    actor_user_id: number,
    is_technical_variant?: boolean,
    variant_preview_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    // check whether the variant with given name for target gear already exists in the database
    const existing_gear_variant = await findGearVariantByGearAndVariantName(gear_id, gear_variant_name)

    if (existing_gear_variant) {
        // check whether the input is identical to database data
        if (isInputIdenticalToDb(existing_gear_variant, is_technical_variant, variant_preview_img_key, status, notes)) return existing_gear_variant

        // update database record with input value
        return await prisma.gearVariant.update({
            where: { id: existing_gear_variant.id },
            data: {
                updated_by_id: actor_user_id,
                ...(is_technical_variant !== undefined && {
                    is_technical_variant: is_technical_variant
                }), 
                ...(variant_preview_img_key !== undefined && {
                    variant_preview_img_key: variant_preview_img_key
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
    return await prisma.gearVariant.create({
        data: {
            gear_id: gear_id,
            gear_variant_name: gear_variant_name,
            is_technical_variant: is_technical_variant ?? false,
            variant_preview_img_key: variant_preview_img_key ?? null,
            status: status ?? status,
            notes: notes ?? null,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id
        }
    })
}