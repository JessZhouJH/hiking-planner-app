import { Router } from "express";

import {
    createRoleController,
    getRoleController,
    updateRoleController,
    deleteRoleController
} from '../../controllers/access-control/role.controller.js'

const router = Router()

router.post('/', createRoleController)
router.get('/', getRoleController)
router.patch('/', updateRoleController)
router.delete('/', deleteRoleController)

export default router