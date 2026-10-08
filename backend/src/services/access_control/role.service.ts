import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export async function upsertRoleData(
    name: string,
    actor_user_id: number,
    status?: Status,
    notes?: string | null
) {
    return await prisma.role.upsert({
        where: { name: name },
        update: {
            updated_by_id: actor_user_id,
            ...(status !== undefined && {
                status: status
            }),
            ...(notes !== undefined && {
                notes: notes
            })
        },
        create: {
            name: name,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null
        },
    })
}

/**
 * findRoleById()
 * helper function to access role details by its id
 * **/
export async function findRoleById(
    id: number
) {
    return await prisma.role.findUnique({where: {id: id}})
}

/**
 * findRoleByName()
 * helper function to access role details by its name
 * **/
export async function findRoleByName(
    name: string
) {
    return await prisma.role.findUnique({where: {name: name}})
}

/**
 * createRole()
 * main function to create new role record
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
 * main function to update an existing role record
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