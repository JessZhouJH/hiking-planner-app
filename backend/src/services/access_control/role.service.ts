import { prisma } from '../../db/prisma.js'
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnprocessableContentError,
    InternalServerError,
    ConflictError,
} from '../../common/error-handler.js'

import { Status } from '../../generated/prisma/enums.js'
import type { Role } from '../../generated/prisma/client.js'
import { ACTION_ACCESS_MAP, ACTION_ACCESS } from '../../common/model-info.js'

import { findUserById } from './user.service.js'
import { findUnitByName } from '../common/unit.service.js'
import { findUserRoleByUserId } from './user_role.service.js'
import { findRolePermissionByFks } from './role_permission.service.js'
import { findPermissionByName } from './permission.service.js'

const ROLE_NAME_REGEX = /^[a-zA-Z0-9_]{2,50}$/
const MODEL_NAME = 'Role'

/**
 * findRoleById()
 * Helper function to access role details by its id
 * no data or user validation involved
 * **/
export async function findRoleById(id: number) {
    return await prisma.role.findUnique({ where: { id: id } })
}

/**
 * findRoleByName()
 * Helper function to access role details by its name
 * no data or user validation involved
 * **/
export async function findRoleByName(name: string) {
    return await prisma.role.findUnique({ where: { name: name } })
}

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
 * isInputValid()
 * Helper function to check whether the input values are valid
 * - name: non empty, unique string, alphabetic characters between 2-50 long
 * - action_user_id: user target exists
 * **/
async function isInputValid(name: string, action_user_id: number) {
    // check whether the role name is valid
    if (name === undefined || name === null) {
        throw new BadRequestError('Role name cannot be empty.')
    }
    if (name.trim().length < 1) {
        throw new BadRequestError('Role name too short.')
    }
    if (!ROLE_NAME_REGEX.test(name.trim())) {
        throw new BadRequestError(
            'Role name can only contain 2 to 50 alphanumeric characters or underscores.'
        )
    }

    // check whether the role name has already been taken
    const existing_role = await findRoleByName(name)
    if (existing_role) {
        throw new ConflictError(
            `Role name "${name}" already exists. Please choose another name.`
        )
    }

    // check whether the action user exists
    const action_user = await findUserById(action_user_id)
    if (!action_user) {
        throw new NotFoundError(
            `User with id ${action_user_id} does not exist.`
        )
    }

    return true
}

/**
 * isUserAuthorisedForAction()
 * Helper function to check whether the user is allowed to perform the desired action
 * - check which role the user has been granted with
 * - check whether this role has been granted with the permission to perform the action
 * **/
async function isUserAuthorisedForAction(
    user_id: number,
    model_name: string,
    ACTION_ACCESS: ACTION_ACCESS
) {
    // check whether the action user exists
    const action_user = await findUserById(user_id)
    if (!action_user) {
        throw new NotFoundError(`User with id ${user_id} does not exist.`)
    }

    // find user's role
    const user_role = await findUserRoleByUserId(user_id)
    if (!user_role) {
        throw new ForbiddenError(
            `User hasn't been assigned with any role to perform ${ACTION_ACCESS.access} action.`
        )
    }

    const role = await findRoleById(user_role.role_id)
    if (!role) {
        throw new ForbiddenError(
            "User has been assigned with a role that doesn't exist. Please contact admin."
        )
    }

    // find the permission
    const permission_string = `${model_name}.${ACTION_ACCESS.action}`
    const permission = await findPermissionByName(permission_string)
    if (!permission) {
        throw new NotFoundError(
            "Permission to perform the action doesn't exist. Please contact admin."
        )
    }

    // find whether the role has been granted with permission to perform the action
    const role_permission = await findRolePermissionByFks(
        role.id,
        permission.id
    )
    if (!role_permission) {
        throw new ForbiddenError(
            `User (${role.name}) does not have the permission to perform ${ACTION_ACCESS.action} action.`
        )
    }
    return true
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
    // TODO: permission check
    const is_user_authorised = await isUserAuthorisedForAction(
        actor_user_id,
        MODEL_NAME,
        ACTION_ACCESS_MAP.create
    )
    // input validation
    const is_input_valid = await isInputValid(name, actor_user_id)
    if (is_input_valid) {
        try {
            return await prisma.role.create({
                data: {
                    name: name,
                    created_by_id: actor_user_id,
                    updated_by_id: actor_user_id,
                    status: status ?? Status.ACTIVE,
                    notes: notes ?? null,
                },
            })
        } catch (error) {
            throw new InternalServerError(
                `Unable to create role ${name} due to unexpected system error.`
            )
        }
    }
    throw new BadRequestError(
        "At least one input doesn' meet requirement, please check and try again."
    )
}

/**
 * getRoleById()
 * Main function to retrieve role record
 * **/
export async function getRoleById(id: number) {}

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
    // TODO: permission check
    try {
        return await prisma.role.update({
            where: { id: role_id },
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
    } catch (error) {}
}

/**
 * deleteRole()
 * main function to delete (deactivate) a role
 * soft deletion will be applied - role's status will be set to ARCHIVED but the record will be retained in the db
 * **/
export async function deleteRole(role_id: number, actor_user_id: number) {
    // TODO: permission check

    try {
        return await prisma.role.update({
            where: { id: role_id },
            data: {
                updated_by_id: actor_user_id,
                status: Status.ARCHIVED,
            },
        })
    } catch (error) {
        // TODO: global error handling
    }
}
