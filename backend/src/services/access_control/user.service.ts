import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js"; 

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/** 
 * function to create user data without checking whether user exists or not
 * suitable when the caller has already ensured that the user does not exist
 * **/
export async function createUserData(
    name: string,
    email: string,
    actor_user_id: number,
    password_hash?: string,
    avatar_key?: string
) {
    return prisma.user.create({
        data: {
            name: name,
            email: email,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            password_hash: password_hash,
            avatar_key: avatar_key
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
    password_hash?: string,
    avatar_key?: string
) {
    return prisma.user.upsert({
        where: { email: email },
        // if user already exisited, update data with input value
        update: {
            name: name,
            updated_by_id: actor_user_id,
            ...(password_hash !== undefined && {
                password_hash: password_hash
            }),
            ...(avatar_key !== undefined && {
                avatar_key: avatar_key
            })
        },
        // create new user entry
        create: {
            name: name,
            email: email,
            created_by_id: actor_user_id,
            updated_by_id: actor_user_id,
            password_hash: password_hash ?? null ,
            avatar_key: avatar_key ?? null
        }
    })
}