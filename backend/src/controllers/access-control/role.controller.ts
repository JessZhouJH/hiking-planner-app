import { Request, Response } from 'express'

import { STATUS_LIST } from '../../constants/macros.js'
import { Status } from '../../generated/prisma/enums.js'

import { 
    createRole,
    getRole,
    updateRole,
    deleteRole
} from '../../services/access-control/role.service.js'

import { BadRequestError, NotFoundError } from '../../common/error-handler.js'
import { ok } from 'node:assert'

export async function createRoleController(
    req: Request,
    res: Response
): Promise<void> {
    const {name, user_id, status, notes} = req.body
    if (typeof name !== 'string' || typeof user_id !== 'number') throw new BadRequestError("Role name and user id must have valid types.")
    
    const role = await createRole(
        name,
        user_id,
        status as Status | undefined,
        notes
    )

    res.status(STATUS_LIST.CREATED_STATUS.statusCode).json({message: 'Role created successfully.', data: role})
}

export async function getRoleController(
    req: Request,
    res: Response
): Promise<void> {
    const {role_id, user_id} = req.body
    if(typeof role_id !== 'number' || typeof user_id !== 'number') throw new BadRequestError("Role id and user id must be numbers.")
    
    const role = await getRole(
        role_id,
        user_id
    )

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: "Role retrieved successfully.",
        data: role
    })
}

export async function updateRoleController(
    req: Request,
    res: Response
): Promise<void> {
    const {role_id, user_id, status, notes} = req.body

    if (typeof role_id !== 'number' || typeof user_id !== 'number') 
        throw new BadRequestError("Role id and user id must be numbers.")

    const role = await updateRole(
        role_id,
        user_id,
        status as Status | undefined,
        notes
    )

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Role ${role.name} updated successfully.`,
        data: role
    })
}

export async function deleteRoleController (
    req: Request,
    res: Response
): Promise<void> {
    const {role_id, user_id, notes} = req.body
    if (typeof role_id !== 'number' || typeof user_id !== 'number')
        throw new BadRequestError("Role id and user id must be numbers.")

    const role = await deleteRole(
        role_id,
        user_id,
        notes
    )

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Role ${role.name} deleted successdully.`,
        data: role
    })
}