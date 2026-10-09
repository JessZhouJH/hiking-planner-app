import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * **/
export async function upsertBrandData(
    name: string,
    actor_user_id: number,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    return await prisma.brand.upsert({
        where: { name: name },
        // if the brand already exisited, update data with input value
        update: {
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
        },
        // create new brand entry
        create: {
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
export async function findBrandById( id: number ){
    return await prisma.brand.findUnique({where: { id: id }})
}

/**
 * **/
export async function findBrandByName( name: string ){
    return await prisma.brand.findUnique({where: { name: name }})
}

/**
 * **/
export async function createBrandData(
    name: string,
    actor_user_id: number,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
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