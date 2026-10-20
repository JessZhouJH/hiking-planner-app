import { Request, Response } from "express";

import {
    createRolePermission,
    getRolePermission,
    updateRolePermission,
    deleteRolePermission,
    requireOperableRoleAndPermission
} from '../../services/access-control/role-permission.service.js'

import { STATUS_LIST } from "../../constants/macros.js";

import { BadRequestError } from "../../common/error-handler.js";

export async function createRolePermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const {role_id, permission_id, actor_user_id, notes} = req.body
    if (typeof role_id !== 'number' || typeof permission_id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Role id, permission id, and actor user id must be numbers.')

    const role_permission = await createRolePermission(role_id, permission_id, actor_user_id, notes)

    const {role_name, permission_name} = await requireOperableRoleAndPermission(role_id, permission_id)
    res.status(STATUS_LIST.CREATED_STATUS.statusCode).json({
        message: `Role ${role_name}(id=${role_id}) has been successfully granted with ${permission_name} pemrission(id=${permission_id}).`,
        data: role_permission
    })
}

export async function getRolePermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const {id, actor_user_id} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number') 
        throw new BadRequestError('Id and actor user id must be numbers.')

    const role_permission = await getRolePermission(id, actor_user_id)
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Successfully retrieved role-permission (id=${id}).`,
        data: role_permission
    })
}

export async function updateRolePermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const {id, actor_user_id, notes} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number') 
        throw new BadRequestError('Id and actor user id must be numbers.')

    const role_permission = await updateRolePermission(id, actor_user_id, notes)
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Successfully updated role-permission (id=${id}).`,
        data: role_permission
    })
}

export async function deleteRolePermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const {id, actor_user_id, notes} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number') 
        throw new BadRequestError('Id and actor user id must be numbers.')

    const role_permission = await deleteRolePermission(id, actor_user_id, notes)
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Successfully deleted role-permission (id=${id}).`,
        data: role_permission
    })
}