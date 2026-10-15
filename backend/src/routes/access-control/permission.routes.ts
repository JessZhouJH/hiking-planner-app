import { Router } from 'express'
import { createPermissionController } from '../../controllers/access-control/permission.controller.js'

const router = Router()

router.post('/', createPermissionController)

export default router
