import { prisma } from '../../db/prisma.js'
import { BadRequestError } from '../../common/error-handler.js'

import { RBACStatus } from '../../generated/prisma/enums.js'
import type { RolePermission } from '../../generated/prisma/client.js'

import { findRolePermissionByFks } from './role-permission.query.js'
import { requireAuthorisedUser } from '../../auth/access-validation.js'

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

export async function grantRolePermission(
    role_id: number,
    permission_id: number,
    actor_user_id: number,
    status?: RBACStatus,
    notes?: string | null
) {
    const existing_role_permission = await findRolePermissionByFks(
        role_id,
        permission_id
    )
    if (existing_role_permission) return existing_role_permission
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

export async function revokeRolePermission(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    return prisma.rolePermission.update({
        where: { id: id },
        data: {
            status: RBACStatus.ARCHIVED,
            revoked_by_id: actor_user_id,
            ...(notes !== undefined && {
                notes: notes,
            }),
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
    // create new record

}


export async function updateRolePermission(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // TODO: permission check
    try {
        return prisma.rolePermission.update({
            where: { id: id },
            data: {
                updated_by_id: actor_user_id,
                ...(notes !== undefined && {
                    notes: notes,
                }),
            },
        })
    } catch (error) {
        // TODO: global error handling
    }
}
