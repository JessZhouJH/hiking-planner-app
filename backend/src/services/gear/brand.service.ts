import { prisma } from '../../db/prisma.js'

import { Status } from '../../generated/prisma/enums.js'
import type { Brand } from '../../generated/prisma/client.js'

import { BadRequestError, NotFoundError, ConflictError } from '../../common/error-handler.js'
import { requireAuthorisedUser } from '../../auth/access-validation.js'
import { requireValidStatus, requireValidPathKey } from '../../common/input-validation.js'
import { ACTION_TYPES } from '../../common/model-info.js'
import { stringProcessing } from '../../common/string-processing.js'

const MODEL_NAME = 'Brand'

/**
 * findBrandById()
 * Helper function to retrieve brand entry by id
 * No permission check happens at this stage
**/
export async function findBrandById( id: number ){
    return await prisma.brand.findUnique({where: { id: id }})
}

/**
 * findNonArchivedBrandByName()
 * Helper function to check whether there's existing and non archived brand that occupied the desired name.
 * No permission check happens at this stage.
 * **/
export async function findNonArchivedBrandByName( name: string ){
    return await prisma.brand.findFirst({
        where: { 
            name: name,
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
    db_brand: Brand,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    return (
        (logo_img_key === undefined || logo_img_key === db_brand.logo_img_key) && 
        (status === undefined || status === db_brand.status) && 
        (notes === undefined || notes === db_brand.notes)
        )
}

/**
 * requireOperableBrand()
 * Function to check whether the desired target brand is operable (exists and not archived)
 * **/
export async function requireOperableBrand(brand_id: number) {
    const brand = await findBrandById(brand_id)
    if (brand === null) 
        throw new NotFoundError (`Brand with id ${brand_id} does not exist.`)

    if (brand.status === Status.ARCHIVED)
        throw new BadRequestError(`Brand ${brand.name}(id=${brand_id}) is archived and thus cannot be operated.`)

    return brand
}

/**
 * requireValidIdentityInput()
 * Function to check whether the input for immutable fields has already constructed another brand entry 
 * **/
async function requireValidIdentityInput(
    name: string
){
    const brand_name_string = stringProcessing(name)
    if (brand_name_string === null) throw new BadRequestError("Brand name too short.")

    const existing_brand = await findNonArchivedBrandByName(brand_name_string)
    if (existing_brand) throw new ConflictError(`Brand name ${brand_name_string} already exists.`)

    return brand_name_string
}

/**
 * requireValidMutableInput()
 * Function to check whether the input for mutable fields are valid 
 * **/
async function requireValidMutableInput(
    logo_img_key?: string | null,
    status?: Status
) {
    await requireValidStatus(status)
    await requireValidPathKey(logo_img_key)
}

async function requireValidInput(
    name: string,
    logo_img_key?: string | null,
    status?: Status
){
    // check whether the desired name is valid
    const brand_name_string = await requireValidIdentityInput(name)

    // check whether the immutable data is valid
    await requireValidMutableInput(logo_img_key, status)

    return brand_name_string
}

/**
 * **/
export async function upsertBrandData(
    name: string,
    actor_user_id: number,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    // check whether the brand with given name already exists in the database
    const existing_brand = await findNonArchivedBrandByName(name)
    if (existing_brand) {
        // check whether the input is identical to database data
        if (isInputIdenticalToDb(existing_brand, logo_img_key, status, notes)) return existing_brand

        // update database record with input value
        return await prisma.brand.update({
            where: {id : existing_brand.id },
            data: {
                updated_by_id: actor_user_id,
                ...(logo_img_key !== undefined && {
                    logo_img_key: logo_img_key
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
    // create new brand entry
    return await prisma.brand.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            logo_img_key: logo_img_key,
            notes: notes
        }
    })
}

/**
 * createBrand()
 * Main function to create a new brand record
 * **/
export async function createBrand(
    name: string,
    actor_user_id: number,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.CREATE)

    // check whether the input is valid
    const brand_name_string = await requireValidInput(
        name,
        logo_img_key,
        status
    )

    // create new record
    const brand = await prisma.brand.create({
        data: {
            name: brand_name_string,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            logo_img_key: logo_img_key,
            notes: notes
        }
    })
    return brand
}

/**
 * getBrand()
 * Main function to retrieve brand details
 * **/
export async function getBrand(
    id: number,
    actor_user_id: number
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.READ)

    // retrieve brand data
    const brand = await findBrandById(id)

    if (!brand)
        throw new NotFoundError(`Brand with id ${id} not found.`)

    return brand
}


export async function updateBrand(
    id: number,
    actor_user_id: number,
    logo_img_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.UPDATE)

    // check whether the target brand exist and is not archived
    const brand = await requireOperableBrand(id)

    // check whether the update information is not identical to current record and is valid
    if (isInputIdenticalToDb(brand, logo_img_key, status, notes))
        throw new BadRequestError('The input is identical to current database record and thus no update will be processed.')
    await requireValidMutableInput(logo_img_key, status)

    // update brand record
    return await prisma.brand.update({
        where: {id: id},
        data: {
            updated_by_id: actor_user_id,
            ...(logo_img_key !== undefined && {
                logo_img_key: logo_img_key
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


export async function deleteBrand(
    id: number,
    actor_user_id: number,
    notes?: string | null
) {
    // permission check
    await requireAuthorisedUser(actor_user_id, MODEL_NAME, ACTION_TYPES.DELETE)

    // check whether the target brand exist and is not archived
    const brand = await requireOperableBrand(id)

    // delete the brand by setting its status to ARCHIVED
    return await prisma.brand.update({
        where: {id: id},
        data: {
            updated_by_id: actor_user_id,
            status: Status.ARCHIVED,
            notes: notes !== undefined
                ? `${brand.notes}\nUpon deletion: ${notes}`
                : `${brand.notes}`
        }
    })
}
