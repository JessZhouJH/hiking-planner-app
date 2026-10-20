import { prisma } from '../db/prisma.js'
import fs from 'fs'

import { Status, RBACStatus } from '../generated/prisma/enums.js'
import { BadRequestError, NotFoundError } from './error-handler.js'
/**
 * requireValidStatus()
 * Helper function to check whether the input status is valid
 * **/
export async function requireValidStatus(status?: Status | null) {
    if (status === Status.ARCHIVED) {
        throw new BadRequestError(
            'Status can only be set to ARCHIVED by performing Delete action'
        )
    }
    return true
}

export async function requireValidPathKey(path_key?:string | null) {
    if (path_key === undefined || path_key === null) return true
    if(!fs.existsSync(path_key)) throw new BadRequestError('No file found in the given path.')
    return true
}
