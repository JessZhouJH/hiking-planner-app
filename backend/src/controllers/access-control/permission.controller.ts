import { Request, Response } from 'express'
import {
    createPermission,
    getPermission,
    updatePermission,
    deletePermission,
} from '../../services/access-control/permission.service.js'
import { STATUS_LIST } from '../../constants/macros.js'
import { Status } from '../../generated/prisma/enums.js'
import type { Permission } from '../../generated/prisma/client.js'

import { BadRequestError, NotFoundError } from '../../common/error-handler.js'
export async function createPermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const { name, user_id, status, notes } = req.body
    if (typeof name !== 'string' || typeof user_id !== 'number') {
        throw new BadRequestError(
            'Permission name and user ID must have valid types.'
        )
    }

    const permission = await createPermission(
        name,
        user_id,
        status as Status | undefined,
        notes
    )

    res.status(STATUS_LIST.CREATED_STATUS.statusCode).json({
        message: 'Permission created successfully.',
        data: permission,
    })
}

export async function getPermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const { permission_id, user_id } = req.body
    if (typeof permission_id !== 'number' || typeof user_id !== 'number') {
        throw new BadRequestError('permission id and user id must be numbers.')
    }

    const permission = await getPermission(permission_id, user_id)

    if (permission === null)
        throw new NotFoundError('Target permission not found.')
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: 'Permission retrieved successfully.',
        data: permission,
    })
}

export async function updatePermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const { permission_id, user_id, status, notes } = req.body
    if (typeof permission_id !== 'number' || typeof user_id !== 'number')
        throw new BadRequestError('Permission id and user ID must be numbers.')
    const permission = await updatePermission(
        permission_id,
        user_id,
        status,
        notes
    )

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: 'Permission updated successfully.',
        data: permission,
    })
}

export async function deletePermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const { permission_id, user_id, notes } = req.body
    if (typeof permission_id !== 'number' || typeof user_id !== 'number')
        throw new BadRequestError('Permission id and user ID must be numbers.')
    const permission = await deletePermission(permission_id, user_id, notes)

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: 'Permission deleted successfully.',
        data: permission,
    })
}
