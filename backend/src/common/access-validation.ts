import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'

import { Status } from '../generated/prisma/enums.js'
// import { accessType } from './model-info.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * helper function to get all the permission
 * that have been granted to the user's role **/
export async function getUserRolePermission() {
    // getUserRole(user_id)
    // getRoleAllPermission (role_id)
}

/**
 * helper function to check whether the user:
 * - has been granted with role where
 * the role has been granted with the corresponding permission to perform certain action
 * **/
export async function validateUserPermission(
    model: string
    // access: accessType
) {}
