import { prisma } from '../../db/prisma.js'
import { Status } from '../../generated/prisma/enums.js'

/**
 * findPermissionById()
 * Helper function to retrieve permission detail by querying id
 * No permission check happens at this stage.
 * **/
export async function findPermissionById(
    id: number
) {
    return await prisma.permission.findUnique({
        where: { id: id }
    })
}

/**
 * findActivePermissionByName()
 * Helper function to check whether there's active permission that can be 
 * - assigned to a role, or 
 * - used to control access for certain operation
 * Only existed and active permission can be assigned 
 * No permission check happens at this stage.
 * **/
export async function findActivePermissionByName(
    name: string
) {
    return await prisma.permission.findFirst({
        where: { 
            name: name, 
            status: Status.ACTIVE }
    })
}

/**
 * findNonArchivePermissionByName()
 * Helper function to check whether the desired permission name has been created already
 * No permission check happens at this stage.
 * **/
export async function findNonArchivePermissionByName(
    name: string
) {
    return await prisma.permission.findFirst({
        where: { 
            name: name, 
            status: {
                not: Status.ARCHIVED
            } 
        }
    })
}
