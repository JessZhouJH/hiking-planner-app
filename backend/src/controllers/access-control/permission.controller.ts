import type { Request, Response } from 'express'
import { createPermission } from '../../services/access-control/permission.service.js'
import { Status } from '../../generated/prisma/enums.js'

export async function createPermissionController(
    req: Request,
    res: Response
): Promise<void> {
    const { name, status, notes } = req.body
    const actor_user_id = req.body.actor_user_id
    const permission = await createPermission(
        name,
        actor_user_id,
        status as Status | undefined,
        notes
    )
    res.status(201).json({
        message: 'Permission created successfully.',
        data: permission,
    })
}
