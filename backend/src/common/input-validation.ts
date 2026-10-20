import { prisma } from '../db/prisma.js'

import { Status, RBACStatus } from '../generated/prisma/enums.js'
import { BadRequestError } from './error-handler.js'
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
}
