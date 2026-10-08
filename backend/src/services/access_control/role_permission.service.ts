import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { RBACStatus } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findRolePermissionById(
    id: number
) {
    return await prisma.rolePermission.findUnique({
        where: { id: id }
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
            status: RBACStatus.ACTIVE
        }
    })
}

export async function grantRolePermission(
    role_id: number,
    permission_id: number,
    actor_user_id: number,
    notes?: string | null
) {
    const existing_role_permission = await findRolePermissionByFks(role_id, permission_id)
    if (existing_role_permission) return existing_role_permission
    return await prisma.rolePermission.create({
        data: {
            role_id: role_id,
            permission_id: permission_id,
            granted_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: RBACStatus.ACTIVE,
            notes: notes ?? null
        }
    })
    
}

export async function revokeRolePermission(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // TODO: permission check
    try {
        return prisma.rolePermission.update({
            where: { id: id },
            data: {
                status: RBACStatus.ARCHIVED,
                revoked_by_id: actor_user_id,
                ...(notes !== undefined && { 
                    notes: notes })
            }
        })
    } catch (error) {
        // TODO: global error handling
    }
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
                    notes: notes })
            }
        })
    } catch (error) {
        // TODO: global error handling
    }
}