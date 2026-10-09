import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { RBACStatus } from '../../generated/prisma/enums.js'

import type { UserRole } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findUserRoleById(
    id: number
) {
    return await prisma.userRole.findUnique({
        where: { id: id }
    })
}

export async function findUserRoleByFks(
    user_id: number,
    role_id: number
) {
    return await prisma.userRole.findFirst({
        where: {
            user_id: user_id,
            role_id: role_id,
            status: RBACStatus.ACTIVE
        }
    })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database user-role data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_user_role: UserRole,
    status?: RBACStatus,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_user_role.status) && 
        (notes === undefined || notes === db_user_role.notes)
        )
}

export async function upsertUserRoleData(
    user_id: number,
    role_id: number,
    actor_user_id: number,
    status?: RBACStatus,
    notes?: string | null
) {
    // check whether the user has been granted with such role already
    const existing_user_role = await findUserRoleByFks(user_id, role_id)
    if (existing_user_role) {
        if(isInputIdenticalToDb(existing_user_role, status, notes)) return existing_user_role
        return await prisma.userRole.update({
            where: { id: existing_user_role.id },
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
    return await prisma.userRole.create({
        data: {
            user_id: user_id,
            role_id: role_id,
            granted_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: RBACStatus.ACTIVE,
            notes: notes ?? null
        }
    })
}

export async function grantUserRole(
    user_id: number,
    role_id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // TODO: permission check
    const existing_user_role = await findUserRoleByFks(user_id, role_id)
    if (existing_user_role) return existing_user_role
    return await prisma.userRole.create({
        data: {
            user_id: user_id,
            role_id: role_id,
            granted_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: RBACStatus.ACTIVE,
            notes: notes ?? null
        }
    })
    
}

export async function revokeUserRole(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // TODO: permission check
    try {
        return prisma.userRole.update({
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

export async function updateUserRole(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // TODO: permission check
    try {
        return prisma.userRole.update({
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