import { Request, Response } from "express";

import { STATUS_LIST } from "../../constants/macros.js";
import { BadRequestError } from "../../common/error-handler.js";

import {
    createUserRole,
    getUserRole,
    updateUserRole,
    deleteUserRole,
    requireAcitveUserAndRole
} from '../../services/access-control/user-role.service.js'

export async function createUserRoleController(
    req: Request,
    res: Response
): Promise<void> {
    const {user_id, role_id, actor_user_id, status, notes} = req.body
    if (typeof user_id !== 'number' || typeof role_id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('User id, role id, and actor user id must be numbers.')

    const user_role = await createUserRole(user_id, role_id, actor_user_id, status, notes)
    const {user_name, role_name} = await requireAcitveUserAndRole(user_id, role_id)
    res.status(STATUS_LIST.CREATED_STATUS.statusCode).json({
        message: `Successfully granted user ${user_name}(id=${user_id}) with ${role_name} role (id=${role_id})`,
        data: user_role
    })
}

export async function getUserRoleController(
    req: Request,
    res: Response
): Promise<void> {
    const {id, actor_user_id} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Id and actor user id must be numbers.')

    const user_role = await getUserRole(id, actor_user_id)
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Successfully retrieved user-role item (id=${id})`,
        data: user_role
    })
}

export async function updateUserRoleController(
    req: Request,
    res: Response
): Promise<void> {
    const {id, actor_user_id, notes} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Id and actor user id must be numbers.')

    const user_role = await updateUserRole(id, actor_user_id, notes)
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Successfully updated user-role item (id=${id})`,
        data: user_role
    })
}

export async function deleteUserRoleController(
    req: Request,
    res: Response
): Promise<void> {
    const {id, actor_user_id, notes} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Id and actor user id must be numbers.')

    const user_role = await deleteUserRole(id, actor_user_id, notes)
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Successfully deleted user-role item (id=${id})`,
        data: user_role
    })
}