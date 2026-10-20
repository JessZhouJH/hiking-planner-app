import { prisma } from '../../db/prisma.js'
import { Status } from '../../generated/prisma/enums.js'

/**
 * findRoleById()
 * Helper function to access role details by its id
 * no data or user validation involved
 * **/
export async function findRoleById(id: number) {
    return await prisma.role.findUnique({ where: { id: id } })
}

/**
 * findNonArchiveRoleByName()
 * Helper function to check whether the target role exsits and is not archived
 * **/
export async function findNonArchiveRoleByName(name: string) {
    const role = await prisma.role.findFirst({
        where: {
            name: name,
            status: {
                not: Status.ARCHIVED,
            },
        },
    })
    return role
}
