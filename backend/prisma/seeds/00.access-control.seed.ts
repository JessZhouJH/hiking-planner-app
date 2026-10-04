import { prisma } from "./seed-client"
import { Status } from "../../src/generated/prisma/enums"
export async function seedAccessControl() {

    // User
    const system = await prisma.user.upsert({
        where: { email: "system@example.com" },
        update: { name: "System" },
        create: {
            name: "System",
            email: "system@example.com",
        }
    })
    await prisma.user.update({
        where: { id: system.id },
        data: {
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })

    const adam = await prisma.user.upsert({
        where: {email: "adam@hiking.com"},
        update: {}, 
        create: {
            name: "Adam",
            email: "adam@hiking.com",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })
    const ben = await prisma.user.upsert({
        where: {email: "ben@hiking.com"},
        update: {}, 
        create: {
            name: "Ben",
            email: "ben@hiking.com",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })
    const charlie = await prisma.user.upsert({
        where: {email: "charlie@sampleuser.com"},
        update: {}, 
        create: {
            name: "Charlie",
            email: "charlie@sampleuser.com",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })

    // Role
    const admin = await prisma.role.upsert({
        where: { name: "Admin" },
        update: {},
        create: {
            name: "Admin",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })
    const moderator = await prisma.role.upsert({
        where: { name: "Moderator" },
        update: {},
        create: {
            name: "Moderator",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })
    const user = await prisma.role.upsert({
        where: { name: "User" },
        update: {},
        create: {
            name: "User",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })

    // Permission
    await prisma.permission.upsert({
        where: { name: "AccessControl.create"},
        update: {},
        create: {
            name: "AccessControl.create",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })
    await prisma.permission.upsert({
        where: { name: "AccessControl.read"},
        update: {},
        create: {
            name: "AccessControl.read",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })
    await prisma.permission.upsert({
        where: { name: "AccessControl.update"},
        update: {},
        create: {
            name: "AccessControl.update",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })
    await prisma.permission.upsert({
        where: { name: "AccessControl.delete"},
        update: {},
        create: {
            name: "AccessControl.delete",
            created_by_id: system.id,
            updated_by_id: system.id
        }
    })

    // UserRole
    async function createUserRole(
        user_id: number, 
        role_id: number,
        granted_by_id: number
    ) {
        const existing_user_role = await prisma.userRole.findFirst({
            where: {
                user_id: user_id,
                role_id: role_id,
                status: Status.ACTIVE
            }
        })
        if (existing_user_role) return existing_user_role
        const new_user_role = await prisma.userRole.create({
            data: {
                user_id: user_id,
                role_id: role_id,
                granted_by_id: granted_by_id
            }
        })
        return new_user_role
    }
    await createUserRole(system.id, admin.id, system.id)
    await createUserRole(adam.id, admin.id, system.id)
    await createUserRole(ben.id, moderator.id, system.id)
    await createUserRole(charlie.id, user.id, system.id)

    
}
