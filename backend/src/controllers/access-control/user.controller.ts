import { Request, Response } from "express";

import {
    createUser,
    getUser,
    updateUser,
    deleteUser
} from '../../services/access-control/user.service.js'

import { STATUS_LIST } from "../../constants/macros.js";
import { Status } from "../../generated/prisma/enums.js";

import { BadRequestError, NotFoundError } from "../../common/error-handler.js";
import { create } from "node:domain";

export async function createUserController(
    req: Request,
    res: Response
): Promise<void> {
    const {name, email, actor_user_id, status, password_hash, avatar_key, notes} = req.body
    if (typeof name !== 'string' || typeof email !== 'string' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Email, name, and user id must have valid types.')

    const user = await createUser(
        name,
        email,
        actor_user_id,
        status,
        password_hash,
        avatar_key,
        notes
    )

    res.status(STATUS_LIST.CREATED_STATUS.statusCode).json({
        message: `User ${user.name} (${user.email}) created successfully.`,
        data: user
    })
}

export async function getUserController(
    req: Request,
    res: Response
): Promise<void> {
    const {user_id, actor_user_id} = req.body
    if (typeof user_id !== 'number' || typeof actor_user_id !== 'number') 
        throw new BadRequestError('User id and action user id must be numbers.')

    const user = await getUser(user_id, actor_user_id)

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `User ${user?.name} retrieved sucessfully.`,
        data: user
    })
}

export async function updateUserController(
    req: Request,
    res: Response
): Promise<void> {
    const {user_id, actor_user_id, name, status, password_hash, avatar_key, notes} = req.body

    if (typeof name !== 'string' || typeof user_id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Name, user id, and action user id must have valid types.')

    const user = await updateUser(
        user_id,
        actor_user_id,
        name,
        status,
        password_hash,
        avatar_key,
        notes
    )
    
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `User ${user.name}(id=${user_id}) updated successfully.`,
        data: user
    })
}

export async function deleteUserController(
    req: Request,
    res: Response
): Promise<void> {
    const {user_id, actor_user_id, notes} = req.body
    if (typeof user_id !== 'number' || typeof actor_user_id !== 'number') 
        throw new BadRequestError('User id and action user id must be numbers.')

    const user = await deleteUser(user_id, actor_user_id, notes)
    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `User ${user.name} deleted successfully.`,
        data: user
    })
}