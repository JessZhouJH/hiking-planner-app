import { prisma } from '../../db/prisma.js'
import { Status } from '../../generated/prisma/enums.js'

export async function findPermissionById(
    id: number
) {
    return await prisma.permission.findUnique({
        where: { id: id }
    })
}

export async function findActivePermissionByName(
    name: string
) {
    return await prisma.permission.findUnique({
        where: { 
            name: name, 
            status: Status.ACTIVE }
    })
}

export async function findNonArchivePermissionByName(
    name: string
) {
    return await prisma.permission.findUnique({
        where: { 
            name: name, 
            status: {
                not: Status.ARCHIVED
            } 
        }
    })
}

export async function findPermissionsByNameIncludingArchived(
    name: string
) {
    return await prisma.permission.findMany({
        where: { name: name}
    })
}