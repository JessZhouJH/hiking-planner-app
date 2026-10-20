import { Router } from 'express'
import {
    createPermissionController,
    getPermissionController,
    updatePermissionController,
    deletePermissionController,
} from '../../controllers/access-control/permission.controller.js'

const router = Router()

router.post('/', createPermissionController)
router.get('/', getPermissionController)
router.patch('/', updatePermissionController)
router.delete('/', deletePermissionController)

export default router
