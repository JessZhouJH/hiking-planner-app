import { Router } from "express";

import {
    createUserController,
    getUserController,
    updateUserController,
    deleteUserController
} from '../../controllers/access-control/user.controller.js'

const router = Router()

router.post('/', createUserController)
router.get('/', getUserController)
router.patch('/', updateUserController)
router.delete('/', deleteUserController)

export default router