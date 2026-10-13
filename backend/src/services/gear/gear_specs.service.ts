import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

import { Status, Operator, ValueType } from '../../generated/prisma/enums.js'
import type { Gear, GearSpecs } from '../../generated/prisma/client.js'

import { findGearSpecsDefinitionById } from './gear_specs_definition.service.js'
import { findUnitById } from '../common/unit.service.js'
import { findGearById } from './gear.service.js'
import { findGearVariantById } from './gear_variant.service.js'
import { findGearTypeRelationByFks } from './gear_type_relation.service.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const enum RequiredValueType {
    BOOLEAN,
    TEXTUAL,
    NUMERIC
}

const TextualValueType: ValueType[] =[
    ValueType.FIT,
    ValueType.TEXT,
    ValueType.MATERIAL
]

type DataToValidate = {
    source_unit_id?: number | null,
    value_boolean?: boolean | null,
    value_text?: string | null,
    value_numeric_1?: number | null,
    value_numeric_2?: number | null,
    operator?: Operator | null,
    status: Status,
    notes?: string | null
}

export async function findGearSpecsById ( id: number ){
    return await prisma.gearSpecs.findUnique({ where: { id: id } })
}

export async function findGearSpecsByGearAndSpecDef (
    gear_id: number,
    gear_specs_definition_id: number,
    gear_variant_id?: number | null
) {
    if (gear_variant_id !== undefined && gear_variant_id) {
        return prisma.gearSpecs.findFirst({
            where: {
                gear_id: gear_id,
                gear_specs_definition_id: gear_specs_definition_id,
                gear_variant_id: gear_variant_id
            }
        })
    }
    return await prisma.gearSpecs.findFirst({
        where: {
            gear_id: gear_id,
            gear_specs_definition_id: gear_specs_definition_id,
            gear_variant_id: null
        }
    })
}

function buildDataToValidate(
    db_gear_specs: GearSpecs,
    source_unit_id?: number | null,
    value_boolean?: boolean | null,
    value_text?: string | null,
    value_numeric_1?: number | null,
    value_numeric_2?: number | null,
    operator?: Operator | null,
    status?: Status,
    notes?: string | null
) {
    const new_source_unit_id = (source_unit_id === undefined)
        ? db_gear_specs.source_unit_id
        : source_unit_id
    const new_value_boolean = (value_boolean === undefined)
        ? db_gear_specs.value_boolean
        : value_boolean
    const new_value_text = (value_text === undefined)
        ? db_gear_specs.value_text
        : value_text
    const new_value_numeric_1 = (value_numeric_1 === undefined)
        ? db_gear_specs.value_numeric_1
        : value_numeric_1
    const new_value_numeric_2 = (value_numeric_2 === undefined)
        ? db_gear_specs.value_numeric_2
        : value_numeric_2
    const new_operator = (operator === undefined)
        ? db_gear_specs.operator
        : operator
    const new_status = (status === undefined)
        ? db_gear_specs.status
        : status
    const new_notes = (notes === undefined)
        ? db_gear_specs.notes
        : notes
    const mutable_data_to_validate: DataToValidate = {
        source_unit_id: new_source_unit_id,
        value_boolean: new_value_boolean,
        value_text: new_value_text,
        value_numeric_1: new_value_numeric_1,
        value_numeric_2: new_value_numeric_2,
        operator: new_operator,
        status: new_status,
        notes: new_notes
    }
    return mutable_data_to_validate
}

/**
 * isInputValid()
 * Function to check whether the input type and value align with the restriction from there corresponing gear specs definition 
 * **/
export async function isInputValid(
    gear_specs_definition_id: number,
    data: DataToValidate
) { 
    /* Check whether the proposed GearSpecsDefinition exists */
    const gear_specs_definition = await findGearSpecsDefinitionById(gear_specs_definition_id)
    if (!gear_specs_definition) {
        // TODO: error handling
        throw new Error ("Gear specs definition not found")
    }

    /* Check which value type is of the input */
    const is_input_empty = 
        (data.value_boolean === undefined || data.value_boolean === null) &&
        (data.value_text === undefined || data.value_text === null) &&
        (data.value_numeric_1 === undefined || data.value_numeric_1 === null)
    if (is_input_empty) {
        // TODO: error handling
        throw new Error ("Value input cannot be empty")
    }

    const is_boolean_input = 
        (data.value_boolean !== undefined && data.value_boolean !== null) &&
        (data.value_text === undefined || data.value_text === null) && 
        (data.value_numeric_1 === undefined || data.value_numeric_1 === null) && 
        (data.value_numeric_2 === undefined || data.value_numeric_2 === null) && 
        (data.operator === undefined || data.operator === null) && 
        (data.source_unit_id === undefined || data.source_unit_id === null)
    const is_text_input = 
        (data.value_text !== undefined && data.value_text !== null) && 
        (data.value_boolean === undefined || data.value_boolean === null) &&
        (data.value_numeric_1 === undefined || data.value_numeric_1 === null) && 
        (data.value_numeric_2 === undefined || data.value_numeric_2 === null) && 
        (data.operator === undefined || data.operator === null) && 
        (data.source_unit_id === undefined || data.source_unit_id === null)
    const is_numeric_input = 
        (data.value_numeric_1 !== undefined && data.value_numeric_1 !== null) && 
        (data.value_boolean === undefined || data.value_boolean === null) &&
        (data.value_text === undefined || data.value_text === null)
    
    /* Check whether the input type is homogenerous */
    const is_homogenerous_value_type = 
        (is_boolean_input && !is_text_input && !is_numeric_input) ||
        (!is_boolean_input && is_text_input && !is_numeric_input) ||
        (!is_boolean_input && !is_text_input && is_numeric_input)
    if (!is_homogenerous_value_type) {
        // TODO: error handling
        throw new Error ("Input value type error: only one type of value is allowed")
    }
    const input_type_string = is_boolean_input
        ? "Boolean"
        : is_text_input
            ? "Textual"
            : "Numeric"

    /* Compare the input value type against the required value type from GearSpecsDefinition */
    const required_input_type = gear_specs_definition.value_type === ValueType.BOOLEAN
        ? RequiredValueType.BOOLEAN
        : TextualValueType.indexOf(gear_specs_definition.value_type) > -1
            ? RequiredValueType.TEXTUAL
            : RequiredValueType.NUMERIC
    switch (required_input_type) {
        case RequiredValueType.BOOLEAN:
            if (!is_boolean_input) {
                // TODO: error handling
                throw new Error (`Expected Boolean type input but got ${input_type_string}`)
            }
            return true
        
        case RequiredValueType.TEXTUAL:
            if (!is_text_input) {
                // TODO: error handling
                throw new Error (`Expected Textual type input but got ${input_type_string}`)
            }
            if (data.value_text && data.value_text.trim().length < 1) {
                // TODO: error handling
                throw new Error ("Text input too short")
            }
            return true
        
        case RequiredValueType.NUMERIC:
            if (!is_numeric_input) {
                // TODO: error handling
                throw new Error (`Expected Numeric type input but got ${input_type_string}`)
            }

            /* Check whether the value is infinite and value 2 is no smaller than value 1 (if applicable) */
            const has_value_1 = 
                data.value_numeric_1 !== undefined && 
                data.value_numeric_1 !== null
            const has_value_2 = 
                data.value_numeric_2 !== undefined && 
                data.value_numeric_2 !== null
            if (has_value_1 && !Number.isFinite(data.value_numeric_1) ||
                has_value_2 && !Number.isFinite(data.value_numeric_2)) {
                // TODO: error handling
                throw new Error ("Numeric value cannot be infinite")
            }
            if ((data.value_numeric_1 !== undefined && data.value_numeric_1 !== null) &&
                (data.value_numeric_2 !== undefined && data.value_numeric_2 !== null) &&
                (data.value_numeric_1 > data.value_numeric_2)) {
                // TODO: error handling
                throw new Error ("Value 2 cannot be smaller than Value 1")
            } 

            /* Check RANGE and value_numeric_2 */
            if (data.operator === Operator.RANGE) {
                if (!has_value_2) {
                    // TODO: error handling
                    throw new Error ("Both numeric values are mandatory for RANGE")
                }
                if (!has_value_1) {
                    // TODO: error handling
                    throw new Error ("Both numeric values are mandatory for RANGE")
                }
                
            }
            if (has_value_2) {
                if (!has_value_1) {
                    // TODO: error handling
                    throw new Error ("Both numeric values are mandatory for RANGE")
                }
                if (data.operator !== Operator.RANGE) {
                    // TODO: error handling
                    throw new Error ("Value 2 is only allowed for RANGE operator")
                }
            }

            /* Check whether the unit is of the type required by the GearSpecsDefinition */
            if (data.source_unit_id !== undefined && 
                data.source_unit_id !== null) {
                const source_unit = await findUnitById(data.source_unit_id)
                if (!source_unit) {
                    // TODO: error handling
                    throw new Error ("Input unit not found")
                }
                if (gear_specs_definition.default_unit_id !== undefined && 
                    gear_specs_definition.default_unit_id !== null) {
                    const expected_unit = await findUnitById(gear_specs_definition.default_unit_id)
                    if (!expected_unit) {
                        // TODO: error handling
                        throw new Error ("Gear Specs Definition unit not found")
                    }
                    if (source_unit.category !== expected_unit.category) {
                        // TODO: error handling
                        throw new Error (`Input unit category doesn't match the requirement of ${expected_unit.category}`)
                    }
                }
            } else {
                if (gear_specs_definition.default_unit_id !== undefined && 
                    gear_specs_definition.default_unit_id !== null) {
                    // TODO: error handling
                    throw new Error ("Unit is required from GearSpecsDefinition")
                }
            }
            return true
            
    }
}


/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_gear_specs: GearSpecs,
    source_unit_id?: number | null,
    value_boolean?: boolean | null,
    value_text?: string | null,
    value_numeric_1?: number | null,
    value_numeric_2?: number | null,
    operator?: Operator | null,
    status?: Status,
    notes?: string | null
) {
    return (
        (source_unit_id === undefined || source_unit_id === db_gear_specs.source_unit_id) && 
        (value_boolean === undefined || value_boolean === db_gear_specs.value_boolean) && 
        (value_text === undefined || value_text === db_gear_specs.value_text) && 
        (value_numeric_1 === undefined || value_numeric_1 === db_gear_specs.value_numeric_1) && 
        (value_numeric_2 === undefined || value_numeric_2 === db_gear_specs.value_numeric_2) && 
        (operator === undefined || operator === db_gear_specs.operator) && 
        (status === undefined || status === db_gear_specs.status) && 
        (notes === undefined || notes === db_gear_specs.notes)
        )
}

/**
 * isImmutableIdentityValid()
 * Function to check whether the proposed gear (and its variant) are valid and matches the requirements from proposed gear specs definition 
 * **/
async function isImmutableIdentityValid(
    gear_id: number,
    gear_specs_definition_id: number,
    gear_variant_id?: number | null,
) {
    const gear_specs_definition = await findGearSpecsDefinitionById(gear_specs_definition_id)
    const gear = await findGearById(gear_id)
    const has_gear_variant = (gear_variant_id !== undefined && gear_variant_id !== null)
    const gear_variant = has_gear_variant
        ? await findGearVariantById(gear_variant_id)
        : null
    if (!gear) {
        // TODO: error handling
        throw new Error ("Proposed Gear doesn't exist")
    }
    if (!gear_specs_definition) {
        // TODO: error handling
        throw new Error ("Proposed GearSpecsDefinition doesn't exist")
    }
    /* Check if the gear types match -- GearSpecsDefinition.gear_type_id can be either explicitly equal to or be the parent type of InputGear.gear_type_id */
    const gear_specs_definition_gear_type_id = gear_specs_definition.gear_type_id
    const input_gear_gear_type_id = gear.gear_type_id
    const parent_relation = await findGearTypeRelationByFks(gear_specs_definition_gear_type_id, input_gear_gear_type_id)
    const valid_gear_type = (
        gear_specs_definition_gear_type_id === input_gear_gear_type_id || 
        (parent_relation !== null)
    )
    if (!valid_gear_type){
        // TODO: error handling
        throw new Error ("Proposed gear doesn't satify the gear type requirement")
    }

    /* Check whether the input gear variant's base gear id and the input gear id are identical */
    if (has_gear_variant && gear_variant !== null) {
        if (gear_variant.gear_id !== gear_id) {
            // TODO: error handling
            throw new Error ("Gear variant's base gear and the input gear not match")
        }
    }

    return true
}

export async function upsertGearSpecsData(
    actor_user_id: number, 
    gear_id: number,
    gear_specs_definition_id: number,
    gear_variant_id?: number | null,
    source_unit_id?: number | null,
    value_boolean?: boolean | null,
    value_text?: string | null,
    value_numeric_1?: number | null,
    value_numeric_2?: number | null,
    operator?: Operator | null,
    status?: Status,
    notes?: string | null
) {
    async function updateExistingGearSpecs(gear_specs: GearSpecs) {
        return await prisma.gearSpecs.update({
            where: { id: gear_specs.id },
            data: {
                updated_by_id: actor_user_id,
                ...(source_unit_id !== undefined && {
                    source_unit_id: source_unit_id
                }),
                ...(value_boolean !== undefined && {
                    value_boolean: value_boolean
                }),
                ...(value_text !== undefined && {
                    value_text: value_text
                }),
                ...(value_numeric_1 !== undefined && {
                    value_numeric_1: value_numeric_1}
                ),
                ...(value_numeric_2 !== undefined && {
                    value_numeric_2: value_numeric_2
                }),
                ...(operator !== undefined && {
                    operator: operator
                }),
                ...(notes !== undefined && {
                    notes: notes
                }),
                ...(status !== undefined && {
                    status: status
                }),
            }
        })
    }
    if (!isImmutableIdentityValid) {
        // TODO: error handling
        throw new Error ("Input gear identity error ")
    }
    // check whether the gear specs already exist in the database
    const existing_gear_specs = await findGearSpecsByGearAndSpecDef(
        gear_id, 
        gear_specs_definition_id,
        gear_variant_id
    )

    if (existing_gear_specs) {
        // check whether the input is identical to database data
        if (isInputIdenticalToDb(existing_gear_specs, source_unit_id, value_boolean, value_text, value_numeric_1, value_numeric_2, operator, status, notes)) return existing_gear_specs
    }

    // build up the data that will be validated and stored in the database (if passed validation check)
    const mutable_data_to_validate: DataToValidate =
        existing_gear_specs
            ? buildDataToValidate(existing_gear_specs, source_unit_id, value_boolean, value_text, value_numeric_1, value_numeric_2, operator, status, notes)
            : {
                source_unit_id: source_unit_id,
                value_boolean: value_boolean,
                value_text: value_text,
                value_numeric_1: value_numeric_1,
                value_numeric_2: value_numeric_2,
                operator: operator,
                status: status ?? Status.ACTIVE,
                notes: notes
            }
    
    // check whether the data is valid and can be stored in the database
    if (await isInputValid(gear_specs_definition_id, mutable_data_to_validate) !== true) {
        // TODO: error handling
        throw new Error ("Input is invalid")
    }

    if (existing_gear_specs) return await updateExistingGearSpecs(existing_gear_specs)
    // create new record
    return await prisma.gearSpecs.create({
            data: {
                gear_id: gear_id,
                gear_specs_definition_id: gear_specs_definition_id,
                gear_variant_id: gear_variant_id,
                source_unit_id: source_unit_id,
                value_boolean: value_boolean,
                value_text: value_text,
                value_numeric_1: value_numeric_1,
                value_numeric_2: value_numeric_2,
                operator: operator,
                notes: notes,
                status: status ?? Status.ACTIVE,
                created_by_id: actor_user_id,
                updated_by_id: actor_user_id
            }
        })
}

