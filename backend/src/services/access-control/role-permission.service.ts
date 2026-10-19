import { prisma } from '../../db/prisma.js'
import { BadRequestError, ConflictError, NotFoundError } from '../../common/error-handler.js'

import { RBACStatus } from '../../generated/prisma/enums.js'
import type { RolePermission } from '../../generated/prisma/client.js'
import { ACTION_TYPES } from '../../common/model-info.js'

import { findRolePermissionByFks } from './role-permission.query.js'
import { requireAuthorisedUser } from '../../auth/access-validation.js'
import { requireOperableRole } from './role.service.js'
import { requireOperablePermission } from './permission.service.js'

const MODEL_NAME = 'RolePermission'

async function requireNonArchivedRolePermissionByFks(
    role_id: number,
    permission_id: number
) {
    const role_permission = await prisma.rolePermission.findFirst({
        where: {
            role_id: role_id,
            permission_id: permission_id,
            status: RBACStatus.ACTIVE
        }
    })

    if (!role_permission) return null
    return role_permission
}

async function requireNonArchivedRolePermissionById(
    id: number,
) {
    const role_permission = await prisma.rolePermission.findUnique({
        where: {
            id: id
        }
    })

    if (!role_permission || role_permission.status === RBACStatus.ARCHIVED) 
        throw new ConflictError(`Role-permission(id=${id}) does not exist or has been archived already.`)
    return role_permission
}

export async function requireOperableRoleAndPermission(
    role_id: number,
    permission_id: number
) {
    const role = await requireOperableRole(role_id)
    const role_name = (role !== null)
        ? role.name
        : ""
    const permission = await requireOperablePermission(permission_id)
    const permission_name = (permission !== null)
        ? permission.name
        : ""
    return {role_name, permission_name}
}


/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database role-permission data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_role_permission: RolePermission,
    status?: RBACStatus,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_role_permission.status) &&
        (notes === undefined || notes === db_role_permission.notes)
    )
}

export async function upsertRolePermission(
    role_id: number,
    permission_id: number,
    actor_user_id: number,
    status?: RBACStatus,
    notes?: string | null
) {
    // check whether the user has been granted with such role already
    const existing_role_permission = await findRolePermissionByFks(
        role_id,
        permission_id
    )
    if (existing_role_permission) {
        if (isInputIdenticalToDb(existing_role_permission, status, notes))
            return existing_role_permission
        return await prisma.rolePermission.update({
            where: { id: existing_role_permission.id },
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
    return await prisma.rolePermission.create({
        data: {
            role_id: role_id,
            permission_id: permission_id,
            granted_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? RBACStatus.ACTIVE,
            notes: notes ?? null,
        },
    })
}

export async function createRolePermission(
    role_id: number,
    permission_id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.CREATE)

    // check whether the role and permission exist and are not archived
    const {role_name, permission_name} = await requireOperableRoleAndPermission(role_id, permission_id)
    if (role_name === "" && permission_name === "") throw new BadRequestError('Both role(id=${role_id}) and permission(id=${permission_id}) either not exist or have been archived.')
    if (role_name === "") throw new BadRequestError(`Role(id=${role_id}) does not exist or have been archived.`)
    if (permission_name === "") throw new BadRequestError('Permission(id=${permission_id}) does not exist or have been archived.')
    
    // check whether the role has been granted with certain permission
    const existing_role_permission = await requireNonArchivedRolePermissionByFks(role_id, permission_id)
    if (existing_role_permission !== null) throw new ConflictError(`Role ${role_name} has already been assigned with permission ${permission_name}.`)
    
    // create new record
    return await prisma.rolePermission.create({
        data:{
            role_id: role_id,
            permission_id: permission_id,
            granted_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            notes: notes
        }
    })
}

export async function getRolePermission(
    id: number,
    actor_user_id: number
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.READ)

    const role_permission = await prisma.rolePermission.findUnique({
        where: { id: id }
    })

    if (role_permission === null) 
        throw new NotFoundError(`Role-permission with id ${id} not found.`)
    
    return role_permission
}

export async function updateRolePermission(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.UPDATE)

    // check whether the target role-permission item is operable (exists and non archived)
    const role_permission = await requireNonArchivedRolePermissionById(id)
    if (role_permission.notes === notes) throw new ConflictError('The updated process terminated because the input data is identical to current record in the database.')
    // update record
    return prisma.rolePermission.update({
        where: { id: id },
        data: {
            updated_by_id: actor_user_id,
            ...(notes !== undefined && {
                notes: notes,
            }),
        },
    })
}

export async function deleteRolePermission(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.DELETE)

    // check whether the target role-permission item exist and is not archived
    await requireNonArchivedRolePermissionById(id)

    // delete the role-permission item by setting its status to archived
    return await prisma.rolePermission.update({
        where: {id: id},
        data: {
            updated_by_id: actor_user_id,
            revoked_by_id: actor_user_id,
            revoked_at: new Date(),
            status: RBACStatus.ARCHIVED,
            ...(notes !== undefined && {
                notes: notes
            })
        }
    })
}
