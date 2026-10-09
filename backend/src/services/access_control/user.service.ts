import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { Status } from '../../generated/prisma/enums.js'
import type { User } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * findUserById(), findUserByEmail(), findUserByName()
 * functions to find user in the database by three potential fields:
 * - id, email, name
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
 * createUserData()
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
 * isInputIdenticalToDb()
 * Function to check whether the input is identical to database user data,
 * Undefined input fields are ignored.
 * Used to avoid unnecessary update
 * **/
export function isInputIdenticalToDb(
    db_user: User,
    name?: string,
    password_hash?: string | null,
    avatar_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    return (
        (name === undefined || name === db_user.name) &&
        (password_hash === undefined || password_hash === db_user.password_hash) &&
        (avatar_key === undefined || avatar_key === db_user.avatar_key) &&
        (status === undefined || status === db_user.status) && 
        (notes === undefined || notes === db_user.notes)
        )
}

/**
 * upsertUserData()
 * Function to create user data with checking whether user exists or not before writing user data
 * Suitable for creating the user entry in general
 * **/
export async function upsertUserData(
    name: string,
    email: string,
    actor_user_id: number,
    password_hash?: string | null,
    avatar_key?: string | null,
    status?: Status,
    notes?: string | null
) {
    // check whether user with given email exists in the database already
    const existing_user = await findUserByEmail(email)
    if (existing_user) {
        if (isInputIdenticalToDb(existing_user, name, password_hash, avatar_key, status, notes)) {
            return existing_user
        }
        return prisma.user.update({
            where: { id: existing_user.id },
            data: {
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
            }
        })
    }
    // create new user record
    return prisma.user.create({
        data: {
            name: name,
            email: email,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            password_hash: password_hash ?? null,
            avatar_key: avatar_key ?? null,
            status: status ?? Status.ACTIVE,
            notes: notes ?? null
        },
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