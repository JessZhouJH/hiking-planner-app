import { prisma } from '../../db/prisma.js'

import { Status } from '../../generated/prisma/enums.js'
import type { GearTagRelation } from '../../generated/prisma/client.js'

export async function findGearTagRelationById( id: number ){
    return await prisma.gearTagRelation.findUnique({ where: { id: id }})
}

export async function findNonArchivedGearTagRelationByFks(
    gear_id: number,
    tag_id: number
) {
    return await prisma.gearTagRelation.findFirst({
        where: {
            gear_id: gear_id,
            tag_id: tag_id,
            status: {
                not: Status.ARCHIVED
            }
        }
    })
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_gear_tag_relation: GearTagRelation,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_gear_tag_relation.status) && 
        (notes === undefined || notes === db_gear_tag_relation.notes)
    )
}

export async function upsertGearTagRelationData(
    gear_id: number,
    tag_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // check whether the relation already exists in the database
    const existing_gear_tag_relation = await findNonArchivedGearTagRelationByFks(gear_id, tag_id)
    if(existing_gear_tag_relation) {
        // check whether the input 
        if (isInputIdenticalToDb(existing_gear_tag_relation, status, notes)) return existing_gear_tag_relation
        return await prisma.gearTagRelation.update({
            where: { id: existing_gear_tag_relation.id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== undefined && {
                    status: status
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            }
        })
    }
    // create new record
    return await prisma.gearTagRelation.create({
        data: {
            gear_id: gear_id,
            tag_id: tag_id,
            status: status ?? Status.ACTIVE,
            notes: notes,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id
        }
    })
}
