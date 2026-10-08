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
import { grantUserRole } from '../../src/services/access_control/user_role.sesrvice'
import { grantRolePermission } from '../../src/services/access_control/role_permission.service'
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

    await grantUserRole(system.id, admin.id, system.id)
    await grantUserRole(adam.id, admin.id, system.id)
    await grantUserRole(ben.id, moderator.id, system.id)
    await grantUserRole(charlie.id, user.id, system.id)
    await grantUserRole(dean.id, user.id, system.id)

    // RolePermission -- only AccessControl Module is used for seeding
    let AccessControl: module = MODEL_INFO[0]
    for (var m of AccessControl.models) {
        // assign all CRUD permission to Admin
        let roleId = admin.id
        for (var p of m.permissions) {
            let permissionItem = await prisma.permission.findFirst({
                where: { name: p, status: Status.ACTIVE },
            })
            if (permissionItem) {
                await grantRolePermission(roleId, permissionItem?.id, 1)
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
        await grantRolePermission(moderator.id, userRead.id, system.id)
        await grantRolePermission(user.id, userRead.id, system.id)
    }
    if (userUpdate) {
        await grantRolePermission(user.id, userUpdate.id, system.id)
    }
}
