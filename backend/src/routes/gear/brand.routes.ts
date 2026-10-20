import { Router } from "express";
import {
    createBrandController,
    getBrandController,
    updateBrandController,
    deleteBrandController
} from '../../controllers/gear/brand.controller.js'

const router = Router()

router.post('/',createBrandController)
router.get('/',getBrandController)
router.patch('/',updateBrandController)
router.delete('/',deleteBrandController)

export default router