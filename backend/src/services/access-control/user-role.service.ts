import { prisma } from '../../db/prisma.js'

import { RBACStatus } from '../../generated/prisma/enums.js'
import type { UserRole } from '../../generated/prisma/client.js'
import { ACTION_TYPES } from '../../common/model-info.js'
import { BASE_ROLES, FUNCTIONAL_ROLES } from '../../constants/macros.js'

import { requireAuthorisedUser } from '../../auth/access-validation.js'
import { requireActiveUser } from './user.validation.js'
import { requireAcitveRole } from './role.service.js'

import { BadRequestError, ConflictError, NotFoundError } from '../../common/error-handler.js'
import { findRoleById } from './role.query.js'

const MODEL_NAME = 'UserRole'
enum RoleType {
    BASE,
    FUNCTIONAL
}

export async function findUserRoleById(id: number) {
    return await prisma.userRole.findUnique({
        where: { id: id },
    })
}

export async function findActiveUserRoleByFks(user_id: number, role_id: number) {
    return await prisma.userRole.findFirst({
        where: {
            user_id: user_id,
            role_id: role_id,
            status: RBACStatus.ACTIVE,
        },
    })
}

export async function findUserRolesByUserId(user_id: number) {
    return await prisma.userRole.findMany({ where: { user_id: user_id } })
}

export async function findUserRolesByRoleId(role_id: number) {
    return await prisma.userRole.findMany({ where: { role_id: role_id } })
}

export async function requireAcitveUserAndRole(
    user_id: number,
    role_id: number
) {
    const user = await requireActiveUser(user_id)
    const user_name = (user !== null)
        ? user.name
        : ""

        const role = await requireAcitveRole(role_id)
    const role_name = (role !== null)
        ? role.name
        : ""

    return {user_name, role_name}
}

async function requireNonArchivedUserRoleById(id: number) {
    const user_role = await findUserRoleById(id)
    if (!user_role || user_role.status === RBACStatus.ARCHIVED)
        throw new BadRequestError('User role item does not exist or has been archived.')

    return user_role
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
    const existing_user_role = await findActiveUserRoleByFks(user_id, role_id)
    if (existing_user_role) {
        if (isInputIdenticalToDb(existing_user_role, status, notes))
            return existing_user_role
        return await prisma.userRole.update({
            where: { id: existing_user_role.id },
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
    return await prisma.userRole.create({
        data: {
            user_id: user_id,
            role_id: role_id,
            granted_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: RBACStatus.ACTIVE,
            notes: notes ?? null,
        },
    })
}

export async function createUserRole(
    user_id: number,
    role_id: number,
    actor_user_id: number,
    status?: RBACStatus,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.CREATE)

    // check whether the target user and role object exist
    const {user_name, role_name} = await requireAcitveUserAndRole(user_id,  role_id)
    if (role_name === "" && user_name === "") throw new BadRequestError('Both user(id=${user_id}) and role(id=${role_id}) either not exist or not active.')
    if (user_name === "") throw new BadRequestError('User(id=${user_id}) does not exist or is not active.')
    if (role_name === "") throw new BadRequestError(`Role(id=${role_id}) does not exist or is not active.`)
    
    // check whether the user has already been granted with target role
    const existing_user_role = await findActiveUserRoleByFks(user_id, role_id)
    if (existing_user_role)
        throw new ConflictError(`User ${user_name}(id=${user_id}) has already been granted with role ${role_name}(id=${role_id})`)

    // check whether the user has already been granted with other roles that might conflict
    const user_proposed_role_type = BASE_ROLES.indexOf(role_name) > -1
        ? RoleType.BASE
        : RoleType.FUNCTIONAL
    const user_other_role_list = await findUserRolesByUserId(user_id)
    if (user_other_role_list.length > 1) 
        throw new ConflictError(`User ${user_name}(id=${user_id}) has already been granted with max number of ${user_other_role_list.length} roles`)
    if (user_other_role_list.length === 1) {
        // check what is the type of the other granted role
        const user_other_role = await findRoleById(user_other_role_list[0].role_id)
        if (!user_other_role) 
            throw new BadRequestError(`User ${user_name}(id=${user_id}) has previously been granted with a role that does not exist. Please contact admin.`)
        const user_other_role_type = BASE_ROLES.indexOf(user_other_role.name) > -1
            ? RoleType.BASE
            : RoleType.FUNCTIONAL
        if (user_proposed_role_type === user_other_role_type) {
            const role_error_msg = (user_proposed_role_type === RoleType.BASE)
                ? 'base'
                : 'functional'
            throw new ConflictError(`User ${user_name}(id=${user_id}) has already been granted with a ${role_error_msg} role.`)
        }
    }

    // create new record
    return await prisma.userRole.create({
        data: {
            user_id: user_id,
            role_id: role_id,
            status: status ?? RBACStatus.ACTIVE,
            granted_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            notes: notes
        }
    })
}

export async function getUserRole(
    id: number,
    actor_user_id: number
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.READ)

    const user_role = await prisma.userRole.findUnique({where: {id: id}})
    if (!user_role) 
        throw new NotFoundError(`UserRole with id=${id} not found.`)

    return user_role
}

export async function updateUserRole(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.UPDATE)

    // check whether the target user-role item is operable (exists and non archived)
    const user_role = await requireNonArchivedUserRoleById(id)
    if (user_role.notes === notes) throw new ConflictError('The updated process terminated because the input data is identical to current record in the database.')
        
    return prisma.userRole.update({
        where: { id: id },
        data: {
            updated_by_id: actor_user_id,
            ...(notes !== undefined && {
                notes: notes,
            }),
        },
    })
}

export async function deleteUserRole(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.DELETE)

    // check whether the target user-role item exist and is not archived
    await requireNonArchivedUserRoleById(id)

    // delete the user-role item by setting its status to archived
    return await prisma.userRole.update({
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
