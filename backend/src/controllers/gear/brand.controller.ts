import { Request, Response } from "express";

import {
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand
} from '../../services/gear/brand.service.js'

import { BadRequestError, ConflictError } from "../../common/error-handler.js";
import { STATUS_LIST } from "../../constants/macros.js";

export async function createBrandController(
    req: Request,
    res: Response
): Promise<void> {
    const {name, actor_user_id, logo_img_key, status, notes} = req.body
    if (typeof name !== 'string' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Name and actor user id must have valid type.')

    const brand = await createBrand(name, actor_user_id, logo_img_key, status, notes)
    res.status(STATUS_LIST.CREATED_STATUS.statusCode).json({
        message: `Brand ${brand.name} successfully created.`,
        data: brand
    })
}

export async function getBrandController(
    req: Request,
    res: Response
): Promise<void> {
    const {id ,actor_user_id} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Id and actor user id must be numbers.')

    const brand = await getBrand(id, actor_user_id)

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Brand ${brand.name}(id=${id}) successfully retrieved.`,
        data: brand
    })
}

export async function updateBrandController(
    req: Request,
    res: Response
): Promise<void> {
    const {id, actor_user_id, logo_img_key, status, notes} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Id and actor user id must be numbers.')

    const brand = await updateBrand(id, actor_user_id,logo_img_key,status,notes)

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Brand ${brand.name}(id=${id}) successfully updated.`,
        data: brand
    })
}

export async function deleteBrandController(
    req: Request,
    res: Response
): Promise<void> {
    const {id ,actor_user_id, notes} = req.body
    if (typeof id !== 'number' || typeof actor_user_id !== 'number')
        throw new BadRequestError('Id and actor user id must be numbers.')

    const brand = await deleteBrand(id, actor_user_id, notes)

    res.status(STATUS_LIST.OK_STATUS.statusCode).json({
        message: `Brand ${brand.name}(id=${id}) successfully deleted.`,
        data: brand
    })
}