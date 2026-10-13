import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status, DescribingTargetType } from '../../generated/prisma/enums.js'
import type { Tag } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findTagById( id: number ){
    return await prisma.tag.findUnique({ where: {id: id} })
}

export async function findTagByName( name: string ){
    return await prisma.tag.findUnique({ where: {name: name} })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database tag data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_tag: Tag,
    describe_target_type?: DescribingTargetType,
    status?: Status,
    notes?: string | null,
    merged_into_tag_id?: number | null
) {
    return (
        (describe_target_type !== undefined && describe_target_type === db_tag.describe_target_type ) &&
        (status !== undefined && status === db_tag.status ) &&
        (notes !== undefined && notes === db_tag.notes ) &&
        (merged_into_tag_id !== undefined && merged_into_tag_id === db_tag.merged_into_tag_id )
    )
}

export async function upsertTagData(
    name: string,
    actor_user_id: number,
    describe_target_type?: DescribingTargetType,
    status?: Status,
    notes?: string | null,
    merged_into_tag_id?: number | null
) {
    // check whether the tag with given name already exists in the database
    const existing_tag = await findTagByName(name)
    if (existing_tag) {
        // check whether the tag in the db is identical to input value
        if (isInputIdenticalToDb(existing_tag, describe_target_type, status, notes, merged_into_tag_id)) return existing_tag
        
        // update db record with input data
        return await prisma.tag.update({
            where: { id: existing_tag.id },
            data: {
            updated_by_id: actor_user_id,
            ...(describe_target_type !== undefined && {
                describe_target_type: describe_target_type,
            }),
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
        })
    }
    // create new tag
    return await prisma.tag.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            describe_target_type:
                describe_target_type ?? DescribingTargetType.GEAR_AND_TRAIL,
            status: status ?? Status.ACTIVE,
            notes: notes,
            merged_into_tag_id: merged_into_tag_id,
        },
    })
}
