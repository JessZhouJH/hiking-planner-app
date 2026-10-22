import { Router } from "express";

import {
    createUserRoleController,
    getUserRoleController,
    updateUserRoleController,
    deleteUserRoleController
} from '../../controllers/access-control/user-role.controller.js'

const router = Router()
router.post('/', createUserRoleController)
router.get('/', getUserRoleController)
router.patch('/', updateUserRoleController)
router.delete('/', deleteUserRoleController)

export default router