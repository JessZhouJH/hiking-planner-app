import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function upsertPermissionData(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string
) {
    return await prisma.permission.upsert({
        where: { name: name },
        update: {
            updated_by_id: actor_user_id,
            ...(status !== undefined && {
                status: status
            }),
            ...(notes !== undefined && {
                notes: notes
            })
        },
        create: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null
        }
    })
}

export async function createPermission(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // TODO: permission check

    try {
        return await prisma.permission.create({
            data: {
                name: name,
                created_by_id: actor_user_id,
                updated_by_id: actor_user_id,
                status: status ?? Status.ACTIVE,
                notes: notes ?? null
            }
        })
    } catch (error) {
        // TODO: global error handling
    }
}

export async function findPermissionById(
    id: number
) {
    return await prisma.permission.findUnique({
        where: { id: id }
    })
}

export async function findPermissionByName(
    name: string
) {
    return await prisma.permission.findUnique({
        where: { name: name }
    })
}

export async function updatePermission(
    permission_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string
) {
    // TODO: permission check
    try {
        return await prisma.permission.update({
            where: { id : permission_id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== undefined && {
                    status: status
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

export async function deletePermission(
    permission_id: number,
    actor_user_id: number
) {
    // TODO: permission check
    try {
        return await prisma.permission.update({
            where: { id: permission_id },
            data: {
                status: Status.ARCHIVED,
                updated_by_id: actor_user_id
            }
        })
    } catch (error) {
        // TODO: global error handling
    }
}