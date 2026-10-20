import { prisma } from '../../db/prisma.js'

import type { User } from '../../generated/prisma/client.js'
import { RBACStatus, Status } from '../../generated/prisma/enums.js'
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    ConflictError,
} from '../../common/error-handler.js'
import { findUserById, findUserByEmail } from './user.query.js'
import { requireAuthorisedUser } from '../../auth/access-validation.js'
import { ACTION_TYPES } from '../../common/model-info.js'
import { stringProcessing } from '../../common/string-processing.js'
import { requireValidStatus } from '../../common/input-validation.js'

const MODEL_NAME = 'User'
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

async function requireOperableUser(user_id: number) {
    const user = await prisma.user.findFirst({
        where: {
            id: user_id,
            status: {
                not: Status.ARCHIVED
            }
        }
    })
    if (!user)
        throw new ConflictError(`User with id ${user_id} does not exist or is archived.`)
    return user
}

async function requireValidInput(
    name: string,
    email: string,
    status?: Status | null
) {
    const email_string = stringProcessing(email)
    const name_string = stringProcessing(name)
    if (email_string === null) throw new BadRequestError('Email too short')
    if (name_string === null) throw new BadRequestError('Name too short')

    if (!EMAIL_REGEX.test(email_string)) throw new BadRequestError('Email format error.')
    
    // check whether the email has already been taken
    const existing_user = await findUserByEmail(email_string)
    if(existing_user) throw new ConflictError(`email ${email_string} has already been occupied. Please choose a different email.`)

    await requireValidStatus(status)
    return {email_string, name_string}
    }

/**
 * createUserData()
 * function to create user data without checking whether user exists or not
 * suitable when the caller has already ensured that the user does not exist
 * **/
async function createUserData(
    name: string,
    email: string,
    actor_user_id: number,

    status?: Status,
    password_hash?: string | null,
    avatar_key?: string | null,
    notes?: string | null
) {
    return await prisma.user.create({
        data: {
            name: name,
            email: email,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            password_hash: password_hash,
            avatar_key: avatar_key,
            notes: notes,
        },
    })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database user data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
function isInputIdenticalToDb(
    db_user: User,
    name?: string,
    password_hash?: string | null,
    avatar_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    return (
        (name === undefined || name === db_user.name) &&
        (password_hash === undefined ||
            password_hash === db_user.password_hash) &&
        (avatar_key === undefined || avatar_key === db_user.avatar_key) &&
        (status === undefined || status === db_user.status) &&
        (notes === undefined || notes === db_user.notes)
    )
}

/**
 * upsertUserData()
 * Function to create user data with checking whether user exists or not before writing user data
 * Suitable for creating the user entry in general
 * **/
export async function upsertUserData(
    name: string,
    email: string,
    actor_user_id: number,
    password_hash?: string | null,
    avatar_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    // check whether user with given email exists in the database already
    const existing_user = await findUserByEmail(email)
    if (existing_user) {
        if (
            isInputIdenticalToDb(
                existing_user,
                name,
                password_hash,
                avatar_key,
                status,
                notes
            )
        ) {
            return existing_user
        }
        return prisma.user.update({
            where: { id: existing_user.id },
            data: {
                name: name,
                ...(status !== undefined && {
                    status: status,
                }),
                updated_by_id: actor_user_id,
                ...(password_hash !== undefined && {
                    password_hash: password_hash,
                }),
                ...(avatar_key !== undefined && {
                    avatar_key: avatar_key,
                }),
                ...(notes !== undefined && {
                    notes: notes,
                }),
            },
        })
    }
    // create new user record
    return prisma.user.create({
        data: {
            name: name,
            email: email,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            password_hash: password_hash ?? null,
            avatar_key: avatar_key ?? null,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null,
        },
    })
}

/**
 * createUser()
 * main function to create new user record
 * **/
export async function createUser(
    name: string,
    email: string,
    actor_user_id: number,

    status?: Status,
    password_hash?: string | null,
    avatar_key?: string | null,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.CREATE)

    // check whether the user with given email exists
    const {email_string, name_string} = await requireValidInput(name, email, status)

    // create new record
    return await createUserData(
        name_string,
        email_string,
        actor_user_id,
        status,
        password_hash,
        avatar_key,
        notes
    )
}

export async function getUser(user_id: number, actor_user_id: number) {
    // permission check 
    if (user_id !== actor_user_id) {
        await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.READ)
    }

    return await findUserById(user_id)
}

/**
 * function to update user data
 * **/
export async function updateUser(
    user_id: number,
    actor_user_id: number,
    name?: string,
    status?: Status,
    password_hash?: string | null,
    avatar_key?: string | null,
    notes?: string | null
) {
    // permission check
    if(user_id !== actor_user_id) {
        await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.UPDATE)
    }

    // check whether the user already exists and is not archived
    await requireOperableUser(user_id)

    // check whether the desired status is not ARCHIVED
    await requireValidStatus(status)

    return await prisma.user.update({
        where: { id: user_id },
        data: {
            updated_by_id: actor_user_id,
            ...(name !== undefined && {
                name: name,
            }),
            ...(status !== undefined && {
                status: status,
            }),
            ...(password_hash !== undefined && {
                password_hash: password_hash,
            }),
            ...(avatar_key !== undefined && {
                avatar_key: avatar_key,
            }),
            ...(notes !== undefined && {
                notes: notes,
            }),
        },
    })
}

/**
 * deleteUser()
 * main function to delete (deactivate) an user account
 * soft deletion will be applied - user's status will be set to ARCHIVED but the record will be retained in the db
 * **/
export async function deleteUser(user_id: number, actor_user_id: number, notes?: string | null) {
    // permission check
    if (user_id !== actor_user_id) {
        await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.DELETE)
    }

    await requireOperableUser(user_id)

    return await prisma.$transaction(async (tx) => {
        const deleted_user = await tx.user.update({
            where: {
                id: user_id,
                status: {
                    not: Status.ARCHIVED
                }
            },
            data: {
                updated_by_id: actor_user_id,
                status: Status.ARCHIVED,
                notes: notes
            }
        })

        await tx.userRole.updateMany({
            where: {
                user_id: user_id,
                status: RBACStatus.ACTIVE
            },
            data: {
                updated_by_id: actor_user_id,
                revoked_by_id: actor_user_id,
                revoked_at: new Date(),
                status: RBACStatus.ARCHIVED,
                notes: notes
            }
        })
        return deleted_user
    })
}
