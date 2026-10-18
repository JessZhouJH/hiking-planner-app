import { prisma } from '../../db/prisma.js'
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    ConflictError,
} from '../../common/error-handler.js'

import { RBACStatus, Status } from '../../generated/prisma/enums.js'
import type { Role } from '../../generated/prisma/client.js'

import {
    findRoleById,
    findRoleByName,
    findNonArchiveRoleByName,
} from './role.query.js'
import { stringToTitleCase } from '../../common/string-processing.js'
import { requireAuthorisedUser } from '../../auth/access-validation.js'
import { requireValidStatus } from '../../common/input-validation.js'
import { ACTION_TYPES } from '../../common/model-info.js'

const ROLE_NAME_REGEX = /^[a-zA-Z0-9_]{2,50}$/
const MODEL_NAME = 'Role'

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database role data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
function isInputIdenticalToDb(
    db_role: Role,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_role.status) &&
        (notes === undefined || notes === db_role.notes)
    )
}

/**
 * requireOperableRole()
 * Helper function to check whether the target role exists and is not archived
 * **/
async function requireOperableRole(id: number) {
    const role = await findRoleById(id)
    if (!role) throw new NotFoundError(`Role with id ${id} does not exist.`)
    if (role.status === Status.ARCHIVED)
        throw new ConflictError(
            `Role with id ${id} is archived and thus not operable`
        )
    return role
}

/**
 * requireValidInput()
 * Helper function to check whether the input values are valid
 * - name: non empty, unique string, alphabetic characters between 2-50 long
 * - action_user_id: user target exists
 * **/
async function requireValidInput(name: string, status?: Status | null) {
    const role_string = stringToTitleCase(name)
    // check whether the role name is valid
    if (role_string === null) throw new BadRequestError('Role name too short.')

    if (!ROLE_NAME_REGEX.test(role_string)) {
        throw new BadRequestError(
            'Role name can only contain 2 to 50 alphanumeric characters or underscores.'
        )
    }

    // check whether the permission already exists
    const existing_role = await findNonArchiveRoleByName(role_string)
    if (existing_role)
        throw new ConflictError(`Role ${existing_role} already exists.`)

    // check whether the desired status is not ARCHIVED
    await requireValidStatus(status)

    return role_string
}

/**
 * upsertRoleData()
 * Main function to create role data during seeding stage
 * No user validation involved, only basic input validation
 * **/
export async function upsertRoleData(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // check whether the role with given name already exists in the database
    const existing_role = await findRoleByName(name)
    if (existing_role) {
        // check whether the input is identical to database record
        if (isInputIdenticalToDb(existing_role, status, notes))
            return existing_role

        // update database record with given input
        return await prisma.role.update({
            where: { id: existing_role.id },
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
    // create new role record
    return await prisma.role.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null,
        },
    })
}

/**
 * createRole()
 * Main function to create new role record
 * **/
export async function createRole(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.CREATE)

    // input validation
    const role_string = await requireValidInput(name, status)

    // create new record
    return await prisma.role.create({
        data: {
            name: role_string,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null,
        },
    })
}

/**
 * getRole()
 * **/
export async function getRole(role_id: number, actor_user_id: number) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.READ)

    return await findRoleById(role_id)
}

/**
 * updateRole()
 * Main function to update an existing role record
 * **/
export async function updateRole(
    role_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.UPDATE)

    // check whether the role already exists and is not archived
    await requireOperableRole(role_id)

    // check whether the desired status is not ARCHIVED
    await requireValidStatus(status)

    return await prisma.role.update({
        where: { id: role_id },
        data: {
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
 * deleteRole()
 * main function to delete (deactivate) a role
 * soft deletion will be applied - role's status will be set to ARCHIVED but the record will be retained in the db
 * **/
export async function deleteRole(
    role_id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.DELETE)

    // check whether the target role exist and is currently not archived
    const role = requireOperableRole(role_id)

    /** Compelte the following steps in the same transaction
     * 1) set the target role item status to ARCHIVED
     * 2) check whether there's any user that has been granted with this role
     * 3) If there's any user, revoke the assignment by setting the corresponding user_role entry as ARCHIVED
     * 4) check whether there's any permission that has been granted to this role
     * 5) If there's any permission, set the corresponding role_permission status to ARCHIVED
     * **/

    return await prisma.$transaction(async (tx) => {
        const deleted_role = await tx.role.update({
            where: { id: role_id },
            data: {
                updated_by_id: actor_user_id,
                status: Status.ARCHIVED,
                notes: notes,
            },
        })

        await tx.userRole.updateMany({
            where: {
                role_id: role_id,
                status: RBACStatus.ACTIVE,
            },
            data: {
                updated_by_id: actor_user_id,
                revoked_at: new Date(),
                revoked_by_id: actor_user_id,
                status: RBACStatus.ARCHIVED,
                notes: notes,
            },
        })

        await tx.rolePermission.updateMany({
            where: {
                role_id: role_id,
                status: RBACStatus.ACTIVE,
            },
            data: {
                updated_by_id: actor_user_id,
                revoked_at: new Date(),
                revoked_by_id: actor_user_id,
                status: RBACStatus.ARCHIVED,
                notes: notes,
            },
        })
        return deleted_role
    })
}
