import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status, UnitCategory } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function upsertUnitData(
    name: string,
    category: UnitCategory,
    actior_user_id: number,
    display_name?: string | null,
    
    status?: Status,
    is_base?: boolean,
    scale_to_base?: number | null,
    offset_to_base?: number | null,
    notes?: string | null
) {
    return prisma.unit.upsert({
        where: { name: name },
        update : {
            updated_by_id: actior_user_id,
            category: category,
            is_base: is_base ?? false,
            status: status ?? Status.ACTIVE,
            ...(display_name !== undefined && {
                display_name: display_name
            }),
            ...(scale_to_base !== undefined && {
                scale_to_base: scale_to_base
            }),
            ...(offset_to_base !== undefined && {
                offset_to_base: offset_to_base
            }),
            ...(notes !== undefined && {
                notes: notes
            })
        },
        create: {
            name: name,
            category: category,
            is_base: is_base ?? false,
            created_by_id: actior_user_id,
            updated_by_id: actior_user_id,
            status: Status && Status.ACTIVE,

            display_name: display_name ?? null,
            scale_to_base: scale_to_base ?? null,
            offset_to_base: offset_to_base ?? null,
            notes: notes ?? null
        }
    })
}

export async function createUnit(
    name: string,
    category: UnitCategory,
    actior_user_id: number,

    display_name?: string | null,
    status?: Status,
    is_base?: boolean,
    scale_to_base?: number | null,
    offset_to_base?: number | null,
    notes?: string | null
) {
    return prisma.unit.create({
        data: {
            name: name,
            category: category,
            status: status ?? Status.ACTIVE,
            is_base: is_base ?? false,
            display_name: display_name ?? null,
            scale_to_base: scale_to_base ?? null,
            offset_to_base: offset_to_base ?? null,
            notes: notes ?? null,
            created_by_id: actior_user_id,
            updated_by_id: actior_user_id,
        }
    })
}

export async function findUnitById(
    id: number
) { return await prisma.unit.findUnique({where: { id: id } })}

export async function findUnitByName(
    name: string
) { return await prisma.unit.findUnique({where: { name: name } })}

export async function updateUnit(
    unit_id: number,
    actior_user_id: number,
    
    display_name?: string | null,
    category?: UnitCategory,
    status?: Status,
    is_base?: boolean,
    scale_to_base?: number | null,
    offset_to_base?: number | null,
    notes?: string | null
) {
    // TODO: permission check
    try {
        return prisma.unit.update({
            where: { id: unit_id },
            data: {
                updated_by_id: actior_user_id,
                ...(category !== undefined && {
                    category: category
                }),
                ...(status !== undefined && {
                    status: status
                }),
                ...(is_base !== undefined && {
                    is_base: is_base
                }),
                ...(display_name !== undefined && {
                    display_name: display_name
                }),
                ...(scale_to_base !== undefined && {
                    scale_to_base: scale_to_base
                }),
                ...(offset_to_base !== undefined && {
                    offset_to_base: offset_to_base
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            }
        })
    } catch (error) {
        // TODO: global error handling
    }
} 

export async function deleteUnit(
    unit_id: number,
    actior_user_id: number
) {
    // TODO: permission check
    try {
        return await prisma.unit.update({
            where: { id: unit_id },
            data: {
                status: Status.ARCHIVED,
                updated_by_id: actior_user_id
            }
        })
    } catch (error) {
        // TODO: global error handling
    }
}