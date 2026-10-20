import { Router } from "express";
import {
    createRolePermissionController,
    getRolePermissionController,
    updateRolePermissionController,
    deleteRolePermissionController
} from '../../controllers/access-control/role-permission.controller.js'

const router = Router()

router.post('/', createRolePermissionController)
router.get('/', getRolePermissionController)
router.patch('/', updateRolePermissionController)
router.delete('/', deleteRolePermissionController)

export default router