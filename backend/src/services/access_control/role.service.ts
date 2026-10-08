import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function upsertRoleData(name: string, actor_user_id: number) {
    return prisma.role.upsert({
        where: { name: name },
        update: {
            updated_by_id: actor_user_id,
        },
        create: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
        },
    })
}
