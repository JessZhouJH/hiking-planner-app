import { prisma } from '../../db/prisma.js'

import { RBACStatus, Status } from '../../generated/prisma/enums.js'
import type { Permission } from '../../generated/prisma/client.js'
import {
    findPermissionById,
    findNonArchivePermissionByName,
} from './permission.query.js'
import { requireAuthorisedUser } from '../../auth/access-validation.js'
import { findRolePermissionIdsByPermissionId } from './role-permission.query.js'

import { stringProcessing } from '../../common/string-processing.js'
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    ConflictError,
} from '../../common/error-handler.js'

import { ACTION_TYPES, ACTION_ACCESS_MAP } from '../../common/model-info.js'
const PERMISSION_NAME_REGEX = /^[a-zA-Z_]*\.[a-zA-Z]{2,50}$/
const MODEL_NAME = 'Permission'

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
    if (!permission)
        throw new NotFoundError(`Permission with id ${id} does not exist.`)
    if (permission.status === Status.ARCHIVED)
        throw new ConflictError(
            `Permission with id ${id} is archived and not operable.`
        )
    return permission
}

/**
 * requireValidStatus()
 * Helper function to check whether the input status is valid
 * **/
async function requireValidStatus(status?: Status | null) {
    if (status === Status.ARCHIVED) {
        throw new BadRequestError(
            'Permission can only be set to ARCHIVED by performing Delete action'
        )
    }
}

/**
 * requireValidInput()
 * Helper function to check whether the input values are valid
 * - name: non empty, unique string, alphabetic characters between 2-50 long
 * **/
async function requireValidInput(name: string, status?: Status | null) {
    // normalized permission name
    const permission_string = stringProcessing(name)
    if (permission_string === null)
        throw new BadRequestError('Permission name too short.')

    // check whether the permission name is valid
    if (!PERMISSION_NAME_REGEX.test(permission_string)) {
        throw new BadRequestError(
            "Permission name should be in the format of 'Model.access' and can only contain 2 to 50 alphanumeric characters or underscores."
        )
    }

    // check whether the permission already exists
    const existing_permission =
        await findNonArchivePermissionByName(permission_string)
    if (existing_permission)
        throw new ConflictError(
            `Permission ${permission_string} already exists.`
        )

    // check whether the desired status is not ARCHIVED
    await requireValidStatus(status)

    return permission_string
}

/**
 * upsertPermissionData()
 * Function to insert data into the table
 * No user authentication or input validation
 * Only to be used during seeding stage **/
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
        if (isInputIdenticalToDb(existing_permission, status, notes))
            return existing_permission
        // update database record with input data
        return await prisma.permission.update({
            where: { id: existing_permission.id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== undefined && {
                    status: status,
                }),
                ...(notes !== undefined && {
                    notes: notes,
                }),
            },
        })
    }
    // create new permission record
    return await prisma.permission.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null,
        },
    })
}

/** updatePermissionData()
 * Helper function to update a permission item data
 * No input or accesss validation happen in this function
 * **/
async function updatePermissionData(
    permission_id: number,
    action_user_id: number,
    status?: Status,
    notes?: string | null
) {
    return await prisma.permission.update({
        where: { id: permission_id },
        data: {
            updated_by_id: action_user_id,
            ...(status !== undefined && {
                status: status,
            }),
            ...(notes !== undefined && {
                notes: notes,
            }),
        },
    })
}

/**
 * createPermission()
 * Main function to create new permission record
 * **/
export async function createPermission(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(
        actor_user_id,
        MODEL_NAME,
        ACTION_ACCESS_MAP.create
    )

    // validate input including action user id
    const permission_string = await requireValidInput(name, status)

    // create new record
    return await prisma.permission.create({
        data: {
            name: permission_string,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null,
        },
    })
}

export async function getPermission(
    permission_id: number,
    actor_user_id: number
) {
    // permission check
    await requireAuthorisedUser(
        actor_user_id,
        MODEL_NAME,
        ACTION_ACCESS_MAP.read
    )

    return await findPermissionById(permission_id)
}

/**
 * updatePermission()
 * Main function to update an existing permission record
 * **/
export async function updatePermission(
    permission_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(
        actor_user_id,
        MODEL_NAME,
        ACTION_ACCESS_MAP.update
    )

    // check whether the permission already exists and is not archived
    await requireOperablePermission(permission_id)

    // check whether the desired status is not ARCHIVED
    if (status === Status.ARCHIVED)
        throw new BadRequestError(
            'Permission can only be set to ARCHIVED by performing Delete action'
        )

    return await updatePermissionData(
        permission_id,
        actor_user_id,
        status,
        notes
    )
}

export async function deletePermission(
    permission_id: number,
    actor_user_id: number,
    notes?: string | null
) {
    await requireAuthorisedUser(
        actor_user_id,
        MODEL_NAME,
        ACTION_ACCESS_MAP.delete
    )

    // check whether the target permission is currently not archived
    const permission = await findPermissionById(permission_id)
    if (!permission || permission.status === Status.ARCHIVED)
        throw new BadRequestError(
            'Permission does not exist or has been deleted already.'
        )

    /** complete the following steps in the same transaction:
     * 1) set the permission item status to ARCHIVED
     * 2) check whether there's any role that has been granted with this permission
     * 3) If there's any such role, set the corresponding role_permission entry as ARCHIVED **/

    return await prisma.$transaction(async (tx) => {
        const deleted_permission = await tx.permission.update({
            where: { id: permission_id },
            data: {
                updated_by_id: actor_user_id,
                status: Status.ARCHIVED,
                notes: notes,
            },
        })

        const affected_role_permission_ids =
            await findRolePermissionIdsByPermissionId(permission_id)

        await tx.rolePermission.updateMany({
            where: {
                permission_id: permission_id,
                status: RBACStatus.ACTIVE,
            },
            data: {
                updated_by_id: actor_user_id,
                status: RBACStatus.ARCHIVED,
                revoked_by_id: actor_user_id,
                revoked_at: new Date(),
                notes: notes,
            },
        })
        return deleted_permission
    })
}
