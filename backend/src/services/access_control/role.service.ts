import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'
import type { Role } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * findRoleById()
 * Helper function to access role details by its id
 * **/
export async function findRoleById(
    id: number
) {
    return await prisma.role.findUnique({where: {id: id}})
}

/**
 * findRoleByName()
 * Helper function to access role details by its name
 * **/
export async function findRoleByName(
    name: string
) {
    return await prisma.role.findUnique({where: {name: name}})
}

/**
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database role data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_role: Role,
    status?: Status,
    notes?: string | null
) {
    return (
        (status === undefined || status === db_role.status) && 
        (notes === undefined || notes === db_role.notes)
        )
}

/**
 * upsertRoleData()
 * **/
export async function upsertRoleData(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // check whether the role with given name already exists in the database
    const existing_role = await findRoleByName(name)
    if (existing_role) {
        // check whether the input is identical to database record
        if (isInputIdenticalToDb(existing_role, status, notes)) return existing_role

        // update database record with given input
        return await prisma.role.update({
            where: { id: existing_role.id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== undefined && {
                    status: status
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            }
        })
    }
    // create new role record
    return await prisma.role.create({
        data: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null
        },
    })
}


/**
 * createRole()
 * Main function to create new role record
 * **/
export async function createRole(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // TODO: permission check
    try{
        return await prisma.role.create({
            data: {
                name: name,
                created_by_id: actor_user_id,
                updated_by_id: actor_user_id,
                status: status ?? Status.ACTIVE,
                notes: notes ?? null
            }
        })
    } catch (error) {
        // TODO: global error handling
    }
}

/**
 * updateRole()
 * Main function to update an existing role record
 * **/
export async function updateRole(
    role_id: number,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    // TODO: permission check
    try {
        return await prisma.role.update({
            where: { id:role_id },
            data: {
                updated_by_id: actor_user_id,
                ...(status !== undefined && {
                    status: status
                }),
                ...(notes !== undefined && {
                    notes: notes
                })
            }
        })
    } catch (error) {

    }
}

/**
 * deleteRole()
 * main function to delete (deactivate) a role
 * soft deletion will be applied - role's status will be set to ARCHIVED but the record will be retained in the db
 * **/
export async function deleteRole(
    role_id: number,
    actor_user_id: number
) {
    // TODO: permission check

    try {
        return await prisma.user.update({
            where: { id: role_id },
            data: {
                updated_by_id: actor_user_id,
                status: Status.ARCHIVED
            }
        })
    } catch(error) {
        // TODO: global error handling
    }
    
}