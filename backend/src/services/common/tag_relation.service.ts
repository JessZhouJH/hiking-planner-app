import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findTagRelationById(id: number) {
    return await prisma.tagRelation.findUnique({ where: { id: id } })
}
export async function findTagRelationByFks(
    parent_tag_id: number,
    child_tag_id: number
) {
    return await prisma.tagRelation.findFirst({
        where: {
            parent_tag_id: parent_tag_id,
            child_tag_id: child_tag_id,
            status: Status.ACTIVE,
        },
    })
}

export async function createTagRelationData(
    parent_tag_id: number,
    child_tag_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    const exisiting_tag_relation = await findTagRelationByFks(
        parent_tag_id,
        child_tag_id
    )
    if (exisiting_tag_relation)
        return await prisma.tagRelation.update({
            where: { id: exisiting_tag_relation.id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== null && {
                    status: status,
                }),
                ...(notes !== undefined && {
                    notes: notes,
                }),
            },
        })
    return await prisma.tagRelation.create({
        data: {
            parent_tag_id: parent_tag_id,
            child_tag_id: child_tag_id,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes,
        },
    })
}
