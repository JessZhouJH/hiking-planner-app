import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status, Visibility, Frequency } from '../../generated/prisma/enums.js'
import type { GearPackComponent } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const enum IdentityType {
    GEAR_TYPE,
    DESCRIPTIVE_GEAR,
    FAIL
}

export async function findGearPackComponentById( id: number ){
    return await prisma.gearPackComponent.findUnique( {where: {id: id} } )
}

export async function findGearPackComponentByGearPackId( gear_pack_id: number ) {
    return await prisma.gearPackComponent.findMany({
        where: { gear_type_id: gear_pack_id }
    })
}

export async function findGearPackComponentByIdentity(
    gear_pack_id: number,
    gear_type_id?: number | null,
    descriptive_gear_id?: number | null,
    component_nickname?: string | null
) {
    const component_identity = findComponentIdentity(gear_type_id, descriptive_gear_id)
    switch(component_identity) {
        case IdentityType.FAIL:
            // TODO: error handling
            return null
        case IdentityType.GEAR_TYPE:
            return await prisma.gearPackComponent.findFirst({
                where: {
                    gear_pack_id: gear_pack_id,
                    gear_type_id: gear_type_id,
                    component_nickname: component_nickname ?? null
                }
            })
        case IdentityType.DESCRIPTIVE_GEAR:
            return await prisma.gearPackComponent.findFirst({
                where: {
                    gear_pack_id: gear_pack_id,
                    descriptive_gear_id: descriptive_gear_id,
                    component_nickname: component_nickname ?? null
                }
            })
    }
}

export function findComponentIdentity(
    gear_type_id?: number | null, 
    descriptive_gear_id?: number | null
){
    const has_gear_type =
        gear_type_id !== undefined && gear_type_id !== null

    const has_descriptive_gear =
        descriptive_gear_id !== undefined && descriptive_gear_id !== null

    if (has_gear_type === has_descriptive_gear) {
        // TODO: error handling
        return IdentityType.FAIL
    }
    if (has_gear_type) return IdentityType.GEAR_TYPE
    return IdentityType.DESCRIPTIVE_GEAR
}

export async function checkComponentNicknameUniqueness(
    component_identity: IdentityType,
    gear_pack_id: number,
    gear_type_id?: number | null,
    descriptive_gear_id?: number | null,
    component_nickname?: string | null
) {
    switch (component_identity) {
        case IdentityType.FAIL:
            return false
        case IdentityType.GEAR_TYPE:
            const existing_gear_pack_component_gear_type = await prisma.gearPackComponent.findFirst({
                where: {
                    gear_pack_id: gear_pack_id,
                    gear_type_id: gear_type_id ?? null,
                    component_nickname: component_nickname?? null
                }
            })
            return existing_gear_pack_component_gear_type === null
        case IdentityType.DESCRIPTIVE_GEAR:
            const existing_gear_pack_component_descriptive_gear = await prisma.gearPackComponent.findFirst({
                where: {
                    gear_pack_id: gear_pack_id,
                    descriptive_gear_id: descriptive_gear_id ?? null,
                    component_nickname: component_nickname?? null
                }
            })
            return existing_gear_pack_component_descriptive_gear === null
    }
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_gear_pack_component: GearPackComponent,
    requires_gear_detail?: boolean,
    default_frequency?: Frequency,
    default_qty?: number,
    status?: Status,
    notes?: string | null
) {
    return (
        (requires_gear_detail === undefined || requires_gear_detail === db_gear_pack_component.requires_gear_detail) &&
        (default_frequency === undefined || default_frequency === db_gear_pack_component.default_frequency) &&
        (default_qty === undefined || default_qty === db_gear_pack_component.default_qty) &&
        (status === undefined || status === db_gear_pack_component.status) && 
        (notes === undefined || notes === db_gear_pack_component.notes)
        )
}

export async function upsertGearPackComponentData(
    actor_user_id: number,
    gear_pack_id: number,
    gear_type_id?: number | null,
    descriptive_gear_id?: number | null,
    requires_gear_detail?: boolean,
    component_nickname?: string | null,
    
    default_frequency?: Frequency,
    default_qty?: number,
    update_component_nickname?: boolean,
    component_nickname_new?: string | null,
    
    status?: Status,
    notes?: string | null
) {
    // check whether the input meet identity resctriction
    const gear_pack_component_identity = findComponentIdentity(gear_type_id, descriptive_gear_id)
    if (gear_pack_component_identity === IdentityType.FAIL) {
        // TODO: error handling
        return null
    }
    
    // check whether the record already exists in the database having a combination of:
    // gear_pack_id + gear_type_id/descriptive_gear_id + component_nickname
    const existing_gear_pack_component = await findGearPackComponentByIdentity(gear_pack_id, gear_type_id, descriptive_gear_id, component_nickname)
    if (existing_gear_pack_component) {

        if (update_component_nickname === true && component_nickname_new === undefined) {
                // TODO: error handling
                return null
            }

        // check whether the desired nickname meet uniqueness restriction
        const need_update_nickname = 
            update_component_nickname === true &&
            existing_gear_pack_component.component_nickname !== component_nickname_new

        if (need_update_nickname) {
            // case where the record already exists and the old nickname satifys the uniqueness restriction
            
            if (! await checkComponentNicknameUniqueness(gear_pack_component_identity, gear_pack_id, gear_type_id, descriptive_gear_id, component_nickname_new)) {
                // TODO: error handling
                return null
            }
        } 
        // check whether the input is identical to database data
        const is_other_data_identical = isInputIdenticalToDb(
            existing_gear_pack_component,
            requires_gear_detail,
            default_frequency,
            default_qty,
            status,
            notes
        )
        if (!need_update_nickname && is_other_data_identical) return existing_gear_pack_component

        // update database record with input value
        return await prisma.gearPackComponent.update({
            where: { id: existing_gear_pack_component.id },
            data: {
                updated_by_id: actor_user_id,
                ...(need_update_nickname && {
                    component_nickname: component_nickname_new
                }),
                ...(requires_gear_detail !== undefined &&{
                    requires_gear_detail: requires_gear_detail
                }),
                ...(default_frequency !== undefined && {
                    default_frequency: default_frequency
                }),
                ...(default_qty !== undefined && {
                    default_qty: default_qty
                }),
                ...(status !== undefined && {
                    status: status
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            }
        })
    }
    // check whether the desired nickname meet uniqueness restriction
    if (! await checkComponentNicknameUniqueness(gear_pack_component_identity, gear_pack_id, gear_type_id, descriptive_gear_id, component_nickname)) {
        // TODO: error handling
        return null
    }
    // create new gear pack component record
    return prisma.gearPackComponent.create({
        data: {
            gear_pack_id: gear_pack_id,
            gear_type_id: gear_type_id ?? null,
            descriptive_gear_id: descriptive_gear_id ?? null,
            component_nickname: component_nickname,
            requires_gear_detail: requires_gear_detail ?? true,
            default_frequency: default_frequency ?? Frequency.PER_TRIP,
            default_qty: default_qty ?? 1,
            status: status ?? Status.ACTIVE,
            notes: notes,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id
        }
    })
}