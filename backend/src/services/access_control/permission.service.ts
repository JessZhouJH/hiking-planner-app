import { prisma } from '../../db/prisma.js'

import { Status } from '../../generated/prisma/enums.js'
import type { Permission } from '../../generated/prisma/client.js'
import { 
    findPermissionById,
    findNonArchivePermissionByName 
} from './permission.query.js'

import { stringProcessing } from '../../common/string-processing.js'
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    ConflictError,
} from '../../common/error-handler.js'

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database permission data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
function isInputIdenticalToDb(
    db_permission: Permission,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_permission.status) && 
        (notes === undefined || notes === db_permission.notes)
        )
}

/**
 * requireOperablePermission()
 * Helper function to check whether the target permission exists and is not archived 
 * **/
async function requireOperablePermission(id: number) {
    const permission = await findPermissionById(id)
    if (!permission) throw new NotFoundError(`Permission with id ${id} does not exist.`)
    if(permission.status === Status.ARCHIVED) throw new ConflictError(`Permission with id ${id} is archived and not operable.`)
        return permission
}

export async function upsertPermissionData(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string
) {
    // check whether the permission with given name already exists in the database
    const existing_permission = await findNonArchivePermissionByName(name)
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

    // normalized permission name
    const permission_string = stringProcessing(name)
    if (permission_string === null) throw new BadRequestError('Permission name too short.')

    // check whether the permission already exists
    const existing_permission = await findNonArchivePermissionByName(permission_string)
    if (existing_permission) throw new ConflictError(`Permission ${permission_string} already exists.`)
    
        // create new record
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

export async function updatePermission(
    permission_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string
) {
    // TODO: permission check
    
    // check whether the permission already exists and is not archived
    await requireOperablePermission(permission_id)

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