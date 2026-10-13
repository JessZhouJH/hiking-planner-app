import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'
import type { TagGroup } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findTagGroupById( id: number ){
    return await prisma.tagGroup.findUnique({ where: {id:id} })
}

export async function findTagGroupByName ( name: string ){
    return await prisma.tagGroup.findUnique({ where: {name:name} })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database tag group data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_tag_group: TagGroup,
    status?: Status,
    notes?: string | null,
    merged_into_tag_group_id?: number | null
) {
    return (
        (status !== undefined && status === db_tag_group.status ) &&
        (notes !== undefined && notes === db_tag_group.notes ) &&
        (merged_into_tag_group_id !== undefined && merged_into_tag_group_id === db_tag_group.merged_into_tag_group_id )
    )
}

export async function upsertTagGroupData(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null,
    merged_into_tag_group_id?: number | null
) {
    // check whether the tag group with given name already exists in the database
    const existing_tag_group = await findTagGroupByName(name)
    if (existing_tag_group) {
        // check whether the input is identical to database value
        if (isInputIdenticalToDb(existing_tag_group, status, notes, merged_into_tag_group_id)) return existing_tag_group

        // update database record with input value
        return await prisma.tagGroup.update({
            where: { id: existing_tag_group.id },
            data: {
            updated_by_id: actor_user_id,
            ...(status !== null && {
                status: status,
            }),
            ...(notes !== undefined && {
                notes: notes,
            }),
            ...(merged_into_tag_group_id !== undefined && {
                merged_into_tag_group_id: merged_into_tag_group_id,
            }),
        },
        })
    }
    // create new tag group
    return await prisma.tagGroup.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes,
            merged_into_tag_group_id: merged_into_tag_group_id
        },
    })
}
