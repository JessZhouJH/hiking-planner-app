import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status, ValueType } from '../../generated/prisma/enums.js'
import type { GearSpecsDefinition } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function findGearSpecsDefinitionById( id: number ){
    return await prisma.gearSpecsDefinition.findUnique({ where: { id: id }})
}

export async function findGearSpecsDefinitionByNameAndType(
    name: string,
    gear_type_id: number
) {
    return await prisma.gearSpecsDefinition.findFirst({
        where: {
            name: name,
            gear_type_id: gear_type_id,
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
    db_gear_specs_definition: GearSpecsDefinition,
    value_type?: ValueType,
    is_key_spec?: boolean,
    is_variant_sensitive?: boolean,
    default_unit_id?: number | null,
    status?: Status,
    notes?: string | null
) {
    return (
        (value_type === undefined || value_type === db_gear_specs_definition.value_type) &&
        (is_key_spec === undefined || is_key_spec === db_gear_specs_definition.is_key_spec) &&
        (is_variant_sensitive === undefined || is_variant_sensitive === db_gear_specs_definition.is_variant_sensitive) &&
        (default_unit_id === undefined || default_unit_id === db_gear_specs_definition.default_unit_id) &&
        (status === undefined || status === db_gear_specs_definition.status) && 
        (notes === undefined || notes === db_gear_specs_definition.notes)
        )
}

export async function upsertGearSpecsDefitionData(
    name: string,
    gear_type_id: number,
    value_type: ValueType,
    actor_user_id: number,

    is_key_spec?: boolean,
    is_variant_sensitive?: boolean,
    default_unit_id?: number | null,

    status?: Status,
    notes?: string | null
) {
    // check whether there's already an entry with given name and gear_type_id in the database
    const existing_gear_specs_definition = await findGearSpecsDefinitionByNameAndType(name, gear_type_id)
    if (existing_gear_specs_definition) {
        // check whether the input is identical to database data
        if (isInputIdenticalToDb(existing_gear_specs_definition, value_type, is_key_spec, is_variant_sensitive, default_unit_id, status, notes)) return existing_gear_specs_definition
        // update the record with given data
        return await prisma.gearSpecsDefinition.update({
            where: { id: existing_gear_specs_definition.id },
            data: {
                updated_by_id: actor_user_id,
                value_type: value_type,
                ...(is_key_spec !== undefined && {
                    is_key_spec: is_key_spec
                }),
                ...(is_variant_sensitive !== undefined && {
                    is_variant_sensitive: is_variant_sensitive
                }),
                ...(default_unit_id !== undefined && {
                    default_unit_id: default_unit_id
                }),
                ...(status != undefined && {
                    status: status
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            }
        })
    }

    // create new entry
    return await prisma.gearSpecsDefinition.create({
        data: {
            name: name,
            gear_type_id: gear_type_id,
            value_type: value_type,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,

            is_key_spec: is_key_spec ?? false,
            is_variant_sensitive: is_variant_sensitive ?? false,
            default_unit_id: default_unit_id,

            status: status ?? Status.ACTIVE,
            notes: notes
        }
    })
}