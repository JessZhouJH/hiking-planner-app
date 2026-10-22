import { prisma } from '../../db/prisma.js'

import { Status } from '../../generated/prisma/enums.js'

import { findUserById } from './user.query.js'

import { NotFoundError, ConflictError } from '../../common/error-handler.js'

/**
 * requireActiveUser()
 * Helper function to check whether the given user id is associated with an existing active user
 * **/
export async function requireActiveUser(id: number) {
    const user = await findUserById(id)
    if (!user) throw new NotFoundError(`User with id ${id} does not exist.`)
    if (user.status !== Status.ACTIVE)
        throw new ConflictError(
            `User with id ${id} is archived and not operable.`
        )
    return user
}
