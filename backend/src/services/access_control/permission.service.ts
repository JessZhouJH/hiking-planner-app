import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

import type { Permission } from '../../generated/prisma/client.js'
import { stat } from 'node:fs'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database permission data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_permission: Permission,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_permission.status) && 
        (notes === undefined || notes === db_permission.notes)
        )
}

export async function upsertPermissionData(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string
) {
    // check whether the permission with given name already exists in the database
    const existing_permission = await findPermissionByName(name)
    if (existing_permission) {
        // check whether the input is identical to the database record
        if (isInputIdenticalToDb(existing_permission, status, notes)) return existing_permission
        // update database record with input data
        return await prisma.permission.update({
            where: { id: existing_permission.id },
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
    }
    // create new permission record
    return await prisma.permission.create({
        data: {
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