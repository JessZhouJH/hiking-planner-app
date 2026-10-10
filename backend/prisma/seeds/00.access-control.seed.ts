import { prisma } from './seed-client'
import { Status } from '../../src/generated/prisma/enums'
import {
    MODEL_INFO,
    ACCESS_CONTROL_MODULE_MODELS,
    model,
    module,
} from '../../src/common/model-info'
import { upsertUserData } from '../../src/services/access_control/user.service'
import { upsertRoleData } from '../../src/services/access_control/role.service'
import { upsertPermissionData } from '../../src/services/access_control/permission.service'
import { upsertUserRoleData } from '../../src/services/access_control/user_role.sesrvice'
import { upsertRolePermission } from '../../src/services/access_control/role_permission.service'

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

    const adam = await upsertUserData('Adam', 'adam@sampleuser.com', system.id)
    const ben = await upsertUserData('Ben', 'ben@sampleuser.com', system.id)
    const charlie = await upsertUserData(
        'Charlie',
        'charlie@sampleuser.com',
        system.id
    )
    const dean = await upsertUserData('Dean', 'dean@sampleuser.com', system.id)

    // Role
    const admin = await upsertRoleData('Admin', system.id)
    const moderator = await upsertRoleData('Moderator', system.id)
    const user = await upsertRoleData('User', system.id)

    // Permission
    for (var module of MODEL_INFO) {
        for (var model of module.models) {
            for (var permission of model.permissions) {
                await upsertPermissionData(permission, system.id)
            }
        }
    }

    // UserRole

    await upsertUserRoleData(system.id, admin.id, system.id)
    await upsertUserRoleData(adam.id, admin.id, system.id)
    await upsertUserRoleData(ben.id, moderator.id, system.id)
    await upsertUserRoleData(charlie.id, user.id, system.id)
    await upsertUserRoleData(dean.id, user.id, system.id)

    // RolePermission -- only AccessControl Module is used for seeding
    let AccessControl: module = MODEL_INFO[0]
    for (var m of AccessControl.models) {
        // assign all CRUD permission to Admin
        let role_id = admin.id
        for (var p of m.permissions) {
            let permission = await prisma.permission.findFirst({
                where: { name: p, status: Status.ACTIVE },
            })
            if (permission) {
                await upsertRolePermission(role_id, permission?.id, system.id)
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
        await upsertRolePermission(moderator.id, userRead.id, system.id)
        await upsertRolePermission(user.id, userRead.id, system.id)
    }
    if (userUpdate) {
        await upsertRolePermission(user.id, userUpdate.id, system.id)
    }
}
