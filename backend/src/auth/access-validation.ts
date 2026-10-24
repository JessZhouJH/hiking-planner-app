import { prisma } from '../db/prisma.js'

import { SelectedTargetType, Status, Visibility } from '../generated/prisma/enums.js'
import { ACTION_TYPES, model, OWNER_REQUIRED_MODELS, ROLE_TYPES } from '../common/model-info.js'
import { SYSTEM_USER_ID } from '../constants/macros.js'

import {
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    BadRequestError
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
 * multifactorAccessCheck()
 * Helper function to check whether the system generally allow the user to perform desired action on certain object by considering:
 * - object's ownership
 * - object's status
 * - object's visibility
 * - actor identity
 * **/
export function multifactorAccessCheck(
    actor_user_id: number,
    owner_id: number,
    is_user_admin: boolean,
    is_user_moderator: boolean,
    status: Status,
    visibility: Visibility
) {
    const is_owner = actor_user_id === owner_id
    const is_system_owned = owner_id === SYSTEM_USER_ID

    let user_role_type: ROLE_TYPES = is_user_admin
        ? ROLE_TYPES.ADMIN
        : is_user_moderator
            ? ROLE_TYPES.MODERATOR
            : ROLE_TYPES.USER

    // CREATE is always allowed as long as user has the permission as long as user is not moderator
    let allowed_action_list: ACTION_TYPES[] = []
    if (user_role_type !== ROLE_TYPES.MODERATOR){
        allowed_action_list.push(ACTION_TYPES.CREATE)
    }

    /** 
     * Case ground rules
     * 1) owners can always read, update, and delete but not verify their owned records 
     * 2) moderators only have read-only access unless the record is ready to verify (Public/Restricted + ACTIVE/PENDING)
     * 3) archived records are immutable and thue read-only
     * 4) general users have and only have read access to non self-owned records that are publically visible
     * **/
    switch(status) {
        case Status.ACTIVE:
            // owners can always read, update, and delete their owned records
            if (is_owner) {
                allowed_action_list.push(ACTION_TYPES.READ)
                allowed_action_list.push(ACTION_TYPES.UPDATE)
                allowed_action_list.push(ACTION_TYPES.DELETE)
                break
            }
            // general users have read-only access to active public records
            else if (user_role_type === ROLE_TYPES.USER) {
                if (visibility === Visibility.PUBLIC) {
                    allowed_action_list.push(ACTION_TYPES.READ)
                }
            } else {
                // admin/moderator have read, update, delete(admin-only), verify access to system-owned records
                if (is_system_owned) {
                    allowed_action_list.push(ACTION_TYPES.READ)
                    allowed_action_list.push(ACTION_TYPES.UPDATE)
                    allowed_action_list.push(ACTION_TYPES.VERIFY)
                    if (user_role_type === ROLE_TYPES.ADMIN) {
                        allowed_action_list.push(ACTION_TYPES.DELETE)
                    }
                } 
                // admin/moderator have read, update, verify access to user-owned records with public/restrcited visibility
                else if (visibility === Visibility.PUBLIC || visibility === Visibility.RESTRICTED) {
                    allowed_action_list.push(ACTION_TYPES.READ)
                    allowed_action_list.push(ACTION_TYPES.UPDATE)
                    allowed_action_list.push(ACTION_TYPES.VERIFY)
                }
            }
            // general users are not allowed to access not self-owned active record that is not publically visible
            // admin/moderator are not allowed to access user-owned records with private/unspecified visibility
            break
        
        case Status.INACTIVE:
            // no verification allowed for inactive record
            // owners can always read, update, and delete their owned records
            if (is_owner) {
                allowed_action_list.push(ACTION_TYPES.READ)
                allowed_action_list.push(ACTION_TYPES.UPDATE)
                allowed_action_list.push(ACTION_TYPES.DELETE)
                break
            }

            else if (user_role_type !== ROLE_TYPES.USER) {
                // admin/moderator have read, update(admin-only), delete(admin-only) access to system-owned records
                if (is_system_owned) {
                    allowed_action_list.push(ACTION_TYPES.READ)
                    if (user_role_type === ROLE_TYPES.ADMIN) {
                        allowed_action_list.push(ACTION_TYPES.UPDATE)
                        allowed_action_list.push(ACTION_TYPES.DELETE)
                    }
                } else {
                    // admin/moderator have read-only access to user-owned records with public/restricted visibility
                    if (visibility === Visibility.PUBLIC ||  visibility === Visibility.RESTRICTED) {
                        allowed_action_list.push(ACTION_TYPES.READ)
                    }
                }
            }

            // general users are not allowed to access not self-owned inactive record
            // admin/moderator are not allowed to access user-owned records with private/unspecified visibility
            break
        
        case Status.PENDING:
            // owners can always read, update, and delete their owned records
            if (is_owner) {
                allowed_action_list.push(ACTION_TYPES.READ)
                allowed_action_list.push(ACTION_TYPES.UPDATE)
                allowed_action_list.push(ACTION_TYPES.DELETE)
                break
            }
            
            else if (user_role_type !== ROLE_TYPES.USER) {
                // admin/moderator have read, update, delete(admin-only), verify access to system-owned records
                if (is_system_owned) {
                    allowed_action_list.push(ACTION_TYPES.READ)
                    allowed_action_list.push(ACTION_TYPES.UPDATE)
                    allowed_action_list.push(ACTION_TYPES.VERIFY)
                    if (user_role_type === ROLE_TYPES.ADMIN) {
                        allowed_action_list.push(ACTION_TYPES.DELETE)
                    }
                } else {
                    // admin/moderator have read, update, verify access to user-owned records with public/restricted visibility
                    if (visibility === Visibility.PUBLIC ||  visibility === Visibility.RESTRICTED) {
                        allowed_action_list.push(ACTION_TYPES.READ)
                        allowed_action_list.push(ACTION_TYPES.UPDATE)
                        allowed_action_list.push(ACTION_TYPES.VERIFY)
                    }
                }
            }
            
            // general users are not allowed to access not self-owned pending record
            // admin/moderator are not allowed to access user-owned records with private/unspecified visibility
            break
        
        case Status.ARCHIVED:
            // owners can always read their owned records but cannot action on it once archived
            if (is_owner) {
                allowed_action_list.push(ACTION_TYPES.READ)
                break
            }
            // admin/moderator have Read-only access to public and restricted records, as well as system-owned private/unspecified record
            else if (user_role_type !== ROLE_TYPES.USER) {
                    if (visibility === Visibility.PUBLIC || 
                        visibility === Visibility.RESTRICTED || 
                        is_system_owned
                ) {
                    allowed_action_list.push(ACTION_TYPES.READ)
                }
            }
            // general users are not allowed to access not self-owned archived record
            // admin/moderator are not allowed to access user-owned records with private/unspecified visibility
            break
        
    }
    
    return allowed_action_list
}

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

/**
 * authenticateUserPermission()
 * Helper function to check whether the user is allowed to perform the desired action on the target object by considering:
 * - whether the user has been granted with a role that has been granted with the corresponding permission to perform certain action
 * - whether the system generally allow perform certain action of the object by considering its ownership, status, visibility, and actor identity
 * **/
export async function authenticateUserPermission(
    object_model: model,
    actor_user_id: number,
    owner_id: number,
    action_access: ACTION_TYPES,
    object_status: Status,
    object_visibility: Visibility
) {
    /** Check whether the user has the required permission **/
    const user_allowed_role_ids = await requireAuthorisedUser(actor_user_id, object_model.name, action_access)
    const is_user_admin = user_allowed_role_ids.indexOf(admin_role_id) > -1
    const is_user_moderator = user_allowed_role_ids.indexOf(moderator_role_id) > -1

    /** Check what actions are generally allowed for this object **/
    const allowed_action_list = multifactorAccessCheck(
        actor_user_id,
        owner_id,
        is_user_admin,
        is_user_moderator,
        object_status,
        object_visibility
    )
    if (allowed_action_list.indexOf(action_access) < 0) {
        throw new ForbiddenError('The object does not allow performing desired action.')
    }
    return true
}