import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function upsertTagGroupData(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null,
    merged_into_tag_id?: number | null
) {
    return await prisma.tag.upsert({
        where: { name: name },
        update: {
            updated_by_id: actor_user_id,
            ...(status !== null && {
                status: status,
            }),
            ...(notes !== undefined && {
                notes: notes,
            }),
            ...(merged_into_tag_id !== undefined && {
                merged_into_tag_id: merged_into_tag_id,
            }),
        },
        create: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes,
            merged_into_tag_id: merged_into_tag_id,
        },
    })
}
