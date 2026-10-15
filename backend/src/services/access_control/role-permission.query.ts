import { prisma } from '../../db/prisma.js'
import { RBACStatus } from '../../generated/prisma/enums.js'

/**
 * findRolePermissionById()
 * helper function to locate the target **/
export async function findRolePermissionById(id: number) {
    return await prisma.rolePermission.findUnique({
        where: { id: id },
    })
}

export async function findRolePermissionByFks(
    role_id: number,
    permission_id: number
) {
    return await prisma.rolePermission.findFirst({
        where: {
            role_id: role_id,
            permission_id: permission_id,
            status: RBACStatus.ACTIVE,
        },
    })
}

export async function findPermissionsByRoleId(role_id: number) {
    return await prisma.rolePermission.findMany({ where: { role_id: role_id } })
}

export async function findRolesWithPermissionId(permission_id: number) {
    const role_permissions = await prisma.rolePermission.findMany({
        where: { permission_id: permission_id, status: RBACStatus.ACTIVE },
    })
    return [
        ...new Set(
            role_permissions.map((role_permission) => role_permission.role_id)
        ),
    ]
}

export async function findRolePermissionIdsByPermissionId(
    permission_id: number
) {
    const role_permission_ids = await prisma.rolePermission.findMany({
        where: {
            permission_id: permission_id,
        },
    })

    return [...new Set(role_permission_ids.map((rp) => rp.id))]
}
