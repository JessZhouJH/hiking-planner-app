import { prisma } from '../db/prisma.js'

import { SelectedTargetType, Status, Visibility } from '../generated/prisma/enums.js'
import { ACTION_TYPES, model, OWNER_REQUIRED_MODELS } from '../common/model-info.js'
import { SYSTEM_USER_ID } from '../constants/macros.js'

import {
    ForbiddenError,
    NotFoundError,
    InternalServerError
} from '../common/error-handler.js'

import { findNonArchiveRoleByName } from '../services/access-control/role.query.js'
import { findActivePermissionByName } from '../services/access-control/permission.query.js'
import { findActiveUserRoleByFks } from '../services/access-control/user-role.service.js'
import { findRolesWithPermissionId } from '../services/access-control/role-permission.query.js'
import { requireActiveUser } from '../services/access-control/user.validation.js'

const admin_role = await findNonArchiveRoleByName('Admin')
const moderator_role = await findNonArchiveRoleByName('Moderator')
if (!admin_role || !moderator_role) {
    throw new NotFoundError('Admin and/or Moderator role missing.')
}
const admin_role_id = admin_role.id
const moderator_role_id = moderator_role.id

/**
 * requireAuthorisedUser()
 * Helper function to check whether the user:
 * - has been granted with role where
 * - the role has been granted with the corresponding permission to perform certain action
 * **/
export async function requireAuthorisedUser(
    user_id: number,
    model_name: string,
    action_access: ACTION_TYPES
) {
    // validate user
    await requireActiveUser(user_id)

    // build permission string then find its corresponding permission_id
    const permission_string = `${model_name}.${action_access}`
    const permission = await findActivePermissionByName(permission_string)
    if (!permission)
        throw new InternalServerError(
            "Permission to perform requested action doesn't exist. Please contact admin."
        )

    // get a list of roles that are granted with this permission
    const allowed_role_ids = await findRolesWithPermissionId(permission.id)

    // check whether the user as been granted with any of these roles
    let user_authorised_as_role_ids: number[] = []
    for (var role of allowed_role_ids) {
        const user_role = await findActiveUserRoleByFks(user_id, role)
        if (user_role) {
            user_authorised_as_role_ids.push(user_role.role_id)
        }
    }

    if (user_authorised_as_role_ids.length < 1)
        throw new ForbiddenError(
            `User has not been granted with a role that allowed to perform ${action_access}`
        )
    return user_authorised_as_role_ids
}

export async function requireAuthorisedUserOrUser(
    object_model: model,
    actor_user_id: number,
    owner_id: number,
    action_access: ACTION_TYPES,
    object_visibility: Visibility
) {
    const is_owner = actor_user_id === owner_id
    /** Check whether the user has the required permission **/
    const user_allowed_role_ids = await requireAuthorisedUser(actor_user_id, object_model.name, action_access)
    const is_user_admin = user_allowed_role_ids.indexOf(admin_role_id) > -1
    const is_user_moderator = user_allowed_role_ids.indexOf(moderator_role_id) > -1
    const is_user_admin_or_moderator = is_user_admin || is_user_moderator

    switch (action_access) {
        case ACTION_TYPES.VERIFY:
            // Owner cannot verify their own object regarless of role
            if (is_owner)
                throw new ForbiddenError('User cannot verify their owned objects.')
            // Admin and moderator can verify system owned object regarless of visibility
            if (owner_id === SYSTEM_USER_ID) 
                return true
            // General content can only be verified if they're set to be publically visible or restricted (accessible by admin/moderator and owner)
            if (object_visibility === Visibility.PUBLIC || object_visibility === Visibility.RESTRICTED) 
                return true

            throw new ForbiddenError('The object is currently unable to view and verify due to owner\'s visibility restriction.')
            
        case ACTION_TYPES.CREATE:
            return true
        
        case ACTION_TYPES.READ:
            if (is_owner)
                return true
            if (is_user_admin_or_moderator) {
                // Admin and moderator can read system owned object regarless of visibility
                if (owner_id === SYSTEM_USER_ID) 
                    return true
                // Admin and moderator can read general content if its set to publically visible or restricted (accessible by admin/moderator and owner)
                if (object_visibility === Visibility.PUBLIC || object_visibility === Visibility.RESTRICTED)
                    return true
            } else {
                // General content can only be read if they're set to be publically visible
                if (object_visibility === Visibility.PUBLIC) 
                    return true
            }
            throw new ForbiddenError('The owner has not authorised you to view the object.')
        
        case ACTION_TYPES.UPDATE:
            if (is_owner)
                return true
            if (is_user_admin_or_moderator) {
                // Admin and moderator can update system owned object regarless of visibility
                if (owner_id === SYSTEM_USER_ID) 
                    return true
                // Admin and moderator can read general content if its visibility has been set to restricted--under review process (accessible by admin/moderator and owner)
                if (object_visibility === Visibility.RESTRICTED)
                    return true
            }
            throw new ForbiddenError('The owner has not authorised you to update the object.')
        
        case ACTION_TYPES.DELETE:
            if (is_owner)
                return true
            // Admin can delete system owned object regarless of visibility
            if (is_user_admin && owner_id === SYSTEM_USER_ID)
                return true

            throw new ForbiddenError('Only the owner can delete the object.')
        
        case ACTION_TYPES.EXPORT:
            if (is_owner)
                return true
            if (is_user_admin_or_moderator) {
                // Admin and moderator can read system owned object regarless of visibility
                if (owner_id === SYSTEM_USER_ID) 
                    return true
                // Admin and moderator can read general content if its set to publically visible or restricted (accessible by admin/moderator and owner)
                if (object_visibility === Visibility.PUBLIC || object_visibility === Visibility.RESTRICTED)
                    return true
            } else {
                // General content can only be read if they're set to be publically visible
                if (object_visibility === Visibility.PUBLIC) 
                    return true
            }
            throw new ForbiddenError('The owner has not authorised you to view the object.')

        default:
            throw new ForbiddenError('Action denied following general procedure.')

    }
}