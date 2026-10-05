import { prisma } from './seed-client'
import { Status } from '../../src/generated/prisma/enums'
import {
    MODEL_INFO,
    ACCESS_CONTROL_MODULE_MODELS,
    model,
    module,
} from '../../src/common/model-info'

export async function seedAccessControl() {
    // User
    const system = await prisma.user.upsert({
        where: { email: 'system@example.com' },
        update: { name: 'System' },
        create: {
            name: 'System',
            email: 'system@example.com',
        },
    })
    await prisma.user.update({
        where: { id: system.id },
        data: {
            created_by_id: system.id,
            updated_by_id: system.id,
        },
    })

    const adam = await prisma.user.upsert({
        where: { email: 'adam@hiking.com' },
        update: {},
        create: {
            name: 'Adam',
            email: 'adam@hiking.com',
            created_by_id: system.id,
            updated_by_id: system.id,
        },
    })
    const ben = await prisma.user.upsert({
        where: { email: 'ben@hiking.com' },
        update: {},
        create: {
            name: 'Ben',
            email: 'ben@hiking.com',
            created_by_id: system.id,
            updated_by_id: system.id,
        },
    })
    const charlie = await prisma.user.upsert({
        where: { email: 'charlie@sampleuser.com' },
        update: {},
        create: {
            name: 'Charlie',
            email: 'charlie@sampleuser.com',
            created_by_id: system.id,
            updated_by_id: system.id,
        },
    })

    // Role
    const admin = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: {
            name: 'Admin',
            created_by_id: system.id,
            updated_by_id: system.id,
        },
    })
    const moderator = await prisma.role.upsert({
        where: { name: 'Moderator' },
        update: {},
        create: {
            name: 'Moderator',
            created_by_id: system.id,
            updated_by_id: system.id,
        },
    })
    const user = await prisma.role.upsert({
        where: { name: 'User' },
        update: {},
        create: {
            name: 'User',
            created_by_id: system.id,
            updated_by_id: system.id,
        },
    })

    // Permission
    for (var module of MODEL_INFO) {
        // console.log(module.name)
        for (var model of module.models) {
            for (var permission of model.permissions) {
                await prisma.permission.upsert({
                    where: { name: permission },
                    update: {},
                    create: {
                        name: permission,
                        created_by_id: system.id,
                        updated_by_id: system.id,
                    },
                })
            }
        }
    }

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
                status: Status.ACTIVE,
            },
        })
        if (existing_user_role) return existing_user_role
        const new_user_role = await prisma.userRole.create({
            data: {
                user_id: user_id,
                role_id: role_id,
                granted_by_id: granted_by_id,
            },
        })
        return new_user_role
    }
    await createUserRole(system.id, admin.id, system.id)
    await createUserRole(adam.id, admin.id, system.id)
    await createUserRole(ben.id, moderator.id, system.id)
    await createUserRole(charlie.id, user.id, system.id)

    // RolePermission -- only AccessControl Module is used for seeding

    async function createRolePermission(role_id: number, permission_id: number, granted_by_id: number) {
        const existing_role_permission = await prisma.rolePermission.findFirst({
            where: {
                role_id: role_id,
                permission_id: permission_id,
                status: Status.ACTIVE,
            },
        })
        if (existing_role_permission) return existing_role_permission
        const new_role_permission = await prisma.rolePermission.create({
            data: {
                role_id: role_id,
                permission_id: permission_id,
                granted_by_id: granted_by_id,
            },
        })
        return new_role_permission
    }
    let AccessControl: module = MODEL_INFO[0]
    for (var m of AccessControl.models) {
        // assign all CRUD permission to Admin
        let roleId = 1
        for (var p of m.permissions) {
            let permissionItem = await prisma.permission.findFirst({
                where: { name: p, status: Status.ACTIVE },
            })
            if (permissionItem) {
                await createRolePermission(roleId, permissionItem?.id, 1)
            }
        }
    }

    // assign user with the RU and moderator the R permissions
    let userRead = await prisma.permission.findFirst({
        where: {
            name: 'User.read',
            status: Status.ACTIVE,
        },
    })
    let userUpdate = await prisma.permission.findFirst({
        where: {
            name: 'User.update',
            status: Status.ACTIVE,
        },
    })
    if (userRead) {
        await createRolePermission(2, userRead.id, 1)
        await createRolePermission(3, userRead.id, 1)
    }
    if (userUpdate) {
        await createRolePermission(3, userUpdate.id, 1)
    }
}