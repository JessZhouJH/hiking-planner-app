import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'
import type { Brand } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * **/
export async function findBrandById( id: number ){
    return await prisma.brand.findUnique({where: { id: id }})
}

/**
 * **/
export async function findBrandByName( name: string ){
    return await prisma.brand.findUnique({where: { name: name }})
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_brand: Brand,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    return (
        (logo_img_key === undefined || logo_img_key === db_brand.logo_img_key) && 
        (status === undefined || status === db_brand.status) && 
        (notes === undefined || notes === db_brand.notes)
        )
}

/**
 * **/
export async function upsertBrandData(
    name: string,
    actor_user_id: number,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    // check whether the brand with given name already exists in the database
    const existing_brand = await findBrandByName(name)
    if (existing_brand) {
        // check whether the input is identical to database data
        if (isInputIdenticalToDb(existing_brand, logo_img_key, status, notes)) return existing_brand

        // update database record with input value
        return await prisma.brand.update({
            where: {id : existing_brand.id },
            data: {
                updated_by_id: actor_user_id,
                ...(logo_img_key !== undefined && {
                    logo_img_key: logo_img_key
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
    // create new brand entry
    return await prisma.brand.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            logo_img_key: logo_img_key,
            notes: notes
        }
    })
}

/**
 * **/
export async function createBrand(
    name: string,
    actor_user_id: number,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    // TODO: permission check

    return await prisma.brand.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            logo_img_key: logo_img_key,
            notes: notes
        }
    })
}