import { prisma } from '../db/prisma.js'

import { Status } from '../generated/prisma/enums.js'
import { ACTION_ACCESS_MAP, ACTION_ACCESS, ACTION_TYPES} from './model-info.js'
import {
    ForbiddenError,
    NotFoundError,
    InternalServerError,
} from './error-handler.js'
import { findActivePermissionByName } from '../services/access_control/permission.query.js'

import { findUserRoleByFks } from '../services/access_control/user_role.service.js'
import { findRolesWithPermissionId } from '../services/access_control/role_permission.service.js'
import { requireActiveUser } from '../services/access_control/user.service.js'

/**
 * isUserAuthorisedForAction()
 * Helper function to check whether the user:
 * - has been granted with role where
 * - the role has been granted with the corresponding permission to perform certain action
 * **/
export async function isUserAuthorisedForAction(
    user_id: number,
    model_name: string,
    action_access: ACTION_ACCESS
) {
    // validate user
    await requireActiveUser(user_id)

    // build permission string then find its corresponding permission_id
    const permission_string = `${model_name}.${action_access.access_string}`
    const permission = await findActivePermissionByName(permission_string)
    if (!permission) throw new InternalServerError("Permission to perform requested action doesn't exist. Please contact admin.")
    
    // get a list of roles that are granted with this permission
    const allowed_role_ids = await findRolesWithPermissionId(permission.id)

    // check whether the user as been granted with any of these roles
    for (var role of allowed_role_ids) {
        const user_role = await findUserRoleByFks(user_id, role)
        if (user_role) {
            return true
        }
    }

    throw new ForbiddenError(`User has not been granted with a role that allowed to perform ${action_access.access_string}`)
}

