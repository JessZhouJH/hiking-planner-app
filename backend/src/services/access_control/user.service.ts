import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const MODEL_NAME = 'User'

/**
 * function to create user data without checking whether user exists or not
 * suitable when the caller has already ensured that the user does not exist
 * **/
export async function createUserData(
    name: string,
    email: string,
    actor_user_id: number,
    
    status?: Status,
    password_hash?: string | null,
    avatar_key?: string | null,
    notes?: string | null
) {
    return await prisma.user.create({
        data: {
            name: name,
            email: email,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            status: status ?? Status.ACTIVE,
            password_hash: password_hash,
            avatar_key: avatar_key,
            notes: notes
        }
    })
}

/**
 * function to create user data with checking whether user exists or not before wring user data
 * suitable for creating the user entry in general
 * **/
export async function upsertUserData(
    name: string,
    email: string,
    actor_user_id: number,
    status?: Status,
    password_hash?: string | null,
    avatar_key?: string | null,
    notes?: string | null
) {
    return await prisma.user.upsert({
        where: { email: email },
        // if user already exisited, update data with input value
        update: {
            name: name,
            ...(status !== undefined && {
                status: status,
            }),
            updated_by_id: actor_user_id,
            ...(password_hash !== undefined && {
                password_hash: password_hash,
            }),
            ...(avatar_key !== undefined && {
                avatar_key: avatar_key,
            }),
            ...(notes !== undefined && {
                notes: notes,
            }),
        },
        // create new user entry
        create: {
            name: name,
            email: email,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            password_hash: password_hash ?? null,
            avatar_key: avatar_key ?? null,
            notes: notes ?? null
        },
    })
}

/**
 * functions to find user in the database by three potential fields:
 * - id, name, email
 * **/
export async function findUserById(id: number) {
    return await prisma.user.findUnique({
        where: { id: id },
    })
}
export async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email: email },
    })
}
export async function findUserByName(name: string) {
    return await prisma.user.findMany({
        where: { name: name },
    })
}

/**
 * createUser()
 * main function to create new user record
 * **/
export async function createUser(
    name: string,
    email: string,
    actor_user_id: number,
    
    status?: Status,
    password_hash?: string | null,
    avatar_key?: string | null,
    notes?: string | null
) {
    // TODO: permission check

    // check whether the user with given email exists
    if (await findUserByEmail(email)) return // TODO: error handling

    return await createUserData(name,email,actor_user_id,status,password_hash,avatar_key,notes)
}

/**
 * function to update user data 
 * **/
export async function updateUser(
    user_id: number,
    actor_user_id: number,
    name?: string,    
    status?: Status,
    password_hash?: string | null,
    avatar_key?: string | null,
    notes?: string | null
) {
    // TODO: permission check

    try {
        return await prisma.user.update({
        where: { id: user_id },
        data: {
            updated_by_id: actor_user_id,
            ...(name !== undefined && {
                name: name
                }),
            ...(status !== undefined && {
                status: status
                }),
            ...(password_hash !== undefined && {
                password_hash: password_hash
                }),
            ...(avatar_key !== undefined && {
                avatar_key: avatar_key
                }),
            ...(notes !== undefined && {
                notes: notes
                })
            }
        })
    } catch (error) {
        // TODO: global error handling
    }
}

/**
 * deleteUser()
 * main function to delete (deactivate) an user account
 * soft deletion will be applied - user's status will be set to ARCHIVED but the record will be retained in the db
 * **/
export async function deleteUser(
    user_id: number,
    actor_user_id: number
) {
    // TODO: permission check

    try {
        return await prisma.user.update({
            where: { id: user_id },
            data: {
                updated_by_id: actor_user_id,
                status: Status.ARCHIVED
            }
        })
    } catch(error) {
        // TODO: global error handling
    }
    
}