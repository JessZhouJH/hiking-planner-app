import { prisma } from '../../db/prisma.js'

import { Status } from '../../generated/prisma/enums.js'
import type { Brand } from '../../generated/prisma/client.js'

import { BadRequestError, NotFoundError, ConflictError } from '../../common/error-handler.js'
import { requireAuthorisedUser } from '../../auth/access-validation.js'
import { requireValidStatus } from '../../common/input-validation.js'
import { ACTION_TYPES } from '../../common/model-info.js'

const MODEL_NAME = 'Brand'

/**
 * **/
export async function findBrandById( id: number ){
    return await prisma.brand.findUnique({where: { id: id }})
}

/**
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

export async function requireOperableBrand(brand_id: number) {
    const brand = await prisma.brand.findUnique({
        where: {id: brand_id}
    })
    if (brand === null) 
        throw new NotFoundError (`Brand with id ${brand_id} does not exist.`)

    if (brand.status === Status.ARCHIVED)
        throw new BadRequestError(`Brand ${brand.name}(id=${brand_id}) is archived and thus cannot be operated.`)

    return brand
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

    // check whether the brand already exists

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