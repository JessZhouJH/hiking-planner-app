import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function readUserRole(user_id: number, role_id: number) {
    return await prisma.userRole.findFirst({
        where: {
            role_id: role_id,
            user_id: user_id,
        },
    })
}

export async function upsertUserRoleData(
    user_id: number,
    role_id: number,
    actor_user_id: number
) {
    const existing_user_role = await readUserRole(user_id, role_id)
    if (existing_user_role) return
    return await prisma.userRole.create({
        data: {
            user_id: user_id,
            role_id: role_id,
            granted_by_id: actor_user_id,
        },
    })
}
