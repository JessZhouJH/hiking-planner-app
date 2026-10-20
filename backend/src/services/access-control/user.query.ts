import { prisma } from '../../db/prisma.js'

import { Status } from '../../generated/prisma/enums.js'

/**
 * findUserById(), findUserByEmail(), findUserByName()
 * functions to find user in the database by three potential fields:
 * - id, email, name
 * **/
export async function findUserById(id: number) {
    return await prisma.user.findUnique({
        where: { id: id},
    })
}
export async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email: email },
    })
}
export async function findUserByName(name: string) {
    return await prisma.user.findMany({
        where: { name: name },
    })
}
