import { prisma } from './seed-client'
import { Status } from '../../src/generated/prisma/enums'
import {
    MODEL_INFO,
} from '../../src/common/model-info'

import { upsertUserData } from '../../src/services/access-control/user.service'
import { upsertRoleData } from '../../src/services/access-control/role.service'
import { upsertPermissionData } from '../../src/services/access-control/permission.service'
import { upsertUserRoleData } from '../../src/services/access-control/user-role.service'
import { upsertRolePermission } from '../../src/services/access-control/role-permission.service'
import { SYSTEM_USER_ID } from '../../src/constants/macros'

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
    const jessie = await upsertUserData(
        'Jessie',
        'jessie@sampleuser.com',
        system.id
    )

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
    await upsertUserRoleData(jessie.id, user.id, system.id)

    // RolePermission
    const admin_role_id = admin.id
    const moderator_role_id = moderator.id
    const user_role_id = user.id

    for (var module of MODEL_INFO) {
        let user_forbidden_models: string[] = []
        let user_read_only_models: string[] = []
        console.log(`\nModule ${module.name}`)
        switch (module.name) {
            /** 
             * Access Control Module
             * - Admin: CRUD to all models
             * - Moderator: R-only to all models
             * - User: RU to User model 
             * **/
            case 'AccessControl':
                for (var model of module.models) {
                    for (var permission of model.permissions) {
                        let existing_permission = await prisma.permission.findFirst({
                            where: {
                                name: permission,
                                status: Status.ACTIVE
                            }
                        })
                        if (existing_permission) {
                            await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                            console.log(`Permission ${permission} granted to Role Admin`)

                            if (permission === `${model.name}.read`) {
                                await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Moderator`)

                            }
                            if (permission === 'User.read' || permission === 'User.update') {
                                await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role User`)
                            }
                        }
                    }
                }
                break
            
            /**
             * Common Module
             * - Except MediaArchive and Attachment Model:
             * ---- Admin: CRUD
             * ---- Moderator: R
             * - MediaArchive and Attachment Model:
             * ---- Admin: CRUDV
             * ---- Moderator: RUV
             * ---- User: CRUD 
             * **/
            case 'Common':
                for (var model of module.models) {
                    const exception_models = (model.name === 'MediaAchive' || model.name === 'Attachment')
                        ? true
                        : false
                    for (var permission of model.permissions) {
                        let existing_permission = await prisma.permission.findFirst({
                            where: {
                                name: permission,
                                status: Status.ACTIVE
                            }
                        })
                        if (existing_permission) {
                            await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                            console.log(`Permission ${permission} granted to Role Admin`)

                            if (permission === `${model.name}.read`) {
                                await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Moderator`)
                            }
                            
                            if (exception_models) {
                                if (permission === `${model.name}.verify`) {
                                    await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role Moderator`)
                                } else {
                                    await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role User`)
                                    
                                    if (permission === `${model.name}.update`) {
                                        await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                        console.log(`Permission ${permission} granted to Role Moderator`)
                                    }
                                }
                            }
                        }
                    }
                }
                break
            
            
                /**
             * Gear Module 
             * - Models that the user has NO access: GearTypeRelation, GearSpecsDefinition
             * - Models that the user has R-only access: Brand, GearType, GearTagRelation 
             * - Models without verification requirement: 
             * ---- Admin：CRUD
             * ---- Moderator: R-only 
             * Models with verification requirement:
             * ---- Admin: CRUDV
             * ---- Moderator: RUV
             * **/
            case 'Gear':
                user_forbidden_models = ['GearTypeRelation', 'GearSpecsDefinition']
                user_read_only_models = ['Brand', 'GearType', 'GearTagRelation']
                for (var model of module.models) {
                    const user_has_read_access = user_forbidden_models.indexOf(model.name) < 0
                    const user_has_crud_access = (user_has_read_access && user_read_only_models.indexOf(model.name) < 0)
                    const access_msg = user_has_crud_access
                        ? "full CRUD"
                        : user_has_read_access
                            ? "Read only"
                            : "No"
                    console.log(`General users has ${access_msg} access to model ${model.name}`)
                    for (permission of model.permissions) {
                        let existing_permission = await prisma.permission.findFirst({
                            where: {
                                name: permission,
                                status: Status.ACTIVE
                            }
                        })
                        if (existing_permission) {
                            await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                            console.log(`Permission ${permission} granted to Role Admin`)

                            if (permission === `${model.name}.read`
                            ) {
                                await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Moderator`)
                            }

                            if (model.requiresReview &&  (
                                permission === `${model.name}.update` ||
                                permission === `${model.name}.verify`
                            )) {
                                await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Moderator`)
                            }

                            if (user_has_read_access) {
                                if (user_has_crud_access && permission !== `${model.name}.verify`) {
                                    await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role User`)
                                }
                                else if (permission === `${model.name}.read`) {
                                    await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role User`)
                                }                                
                            }
                        }
                    }
                }
                break
            
            case 'Trail':
                user_forbidden_models = ['DifficultyMapping']
                user_read_only_models = ['Challenge', 'ChallengeGearRequirement', 'DifficultySystem', 'TrailTagRelation', 'TrailDifficulty']
                for (var model of module.models) {
                    const user_has_read_access = user_forbidden_models.indexOf(model.name) < 0
                    const user_has_crud_access = (user_has_read_access && user_read_only_models.indexOf(model.name) < 0)
                    const access_msg = user_has_crud_access
                        ? "full CRUD"
                        : user_has_read_access
                            ? "Read only"
                            : "No"
                    console.log(`General users has ${access_msg} access to model ${model.name}`)
                    for (permission of model.permissions) {
                        let existing_permission = await prisma.permission.findFirst({
                            where: {
                                name: permission,
                                status: Status.ACTIVE
                            }
                        })
                        if (existing_permission) {
                            await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                            console.log(`Permission ${permission} granted to Role Admin`)

                            if (permission === `${model.name}.read`
                            ) {
                                await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Moderator`)
                            }

                            if (model.requiresReview &&  (
                                permission === `${model.name}.update` ||
                                permission === `${model.name}.verify`
                            )) {
                                await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Moderator`)
                            }

                            if (user_has_read_access) {
                                if (user_has_crud_access && permission !== `${model.name}.verify`) {
                                    await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role User`)
                                }
                                else if (permission === `${model.name}.read`) {
                                    await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role User`)
                                }                                
                            }
                        }
                    }
                }
                break
            
            /**
             * Personal Module
             * - Admin & Moderator: NO access
             * - User: full CRUD 
             * **/
            case 'Personal':
                for (var model of module.models) {
                    for (permission of model.permissions) {
                        let existing_permission = await prisma.permission.findFirst({
                            where: {
                                name: permission,
                                status: Status.ACTIVE
                            }
                        })
                        if (existing_permission) {
                            await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                            console.log(`Permission ${permission} granted to Role User`)
                        }
                    }
                }
                break
            
            /**
             * Trip Module
             * - Admin & Moderator: NO access
             * - User: full CRUD 
             * **/
            case 'Trip':
                for (var model of module.models) {
                    for (permission of model.permissions) {
                        let existing_permission = await prisma.permission.findFirst({
                            where: {
                                name: permission,
                                status: Status.ACTIVE
                            }
                        })
                        if (existing_permission) {
                            await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                            console.log(`Permission ${permission} granted to Role User`)
                        }
                    }
                }
                break
            
            /**
             *  Meal Module
             * - MealPack model: Admin CRUDV, Moderator RUV, User CRUD
             * - Other models: Admin, User CRUD, Moderator NO access
             * - **/
            case 'Meal':
                for(var model of module.models) {
                    for (var permission of model.permissions) {
                        let existing_permission = await prisma.permission.findFirst({
                            where: {
                                name: permission,
                                status: Status.ACTIVE
                            }
                        })
                        if (existing_permission) {
                            if (permission === `${model.name}.verify`) {
                                await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Admin`)
                                await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Moderator`)
                            } else {
                                await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Admin`)
                                await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role User`)
                            
                                if (model.name === 'MealPack' && (
                                    permission === `${model.name}.read` ||
                                    permission === `${model.name}.update`
                                )) {
                                    await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role Moderator`)
                                }
                            }
                        }
                    }
                }
                break
            
            case 'Community':
                const user_initiated_models = ['UserFeedback', 'UserProposal']
                for (var model of module.models) {
                    const is_user_initiate_models = user_initiated_models.indexOf(model.name) > -1
                    for (var permission of model.permissions) {
                        let existing_permission = await prisma.permission.findFirst({
                            where: {
                                name: permission,
                                status: Status.ACTIVE
                            }
                        })

                        if (existing_permission) {
                            if (permission === `${model.name}.verify`) {
                                await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Admin`)
                                await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role Moderator`)
                            } else {
                                await upsertRolePermission(user_role_id, existing_permission.id, SYSTEM_USER_ID)
                                console.log(`Permission ${permission} granted to Role User`)

                                if (permission === `${model.name}.read` || permission === `${model.name}.update`) {
                                    await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role Admin`)
                                    await upsertRolePermission(moderator_role_id, existing_permission.id, SYSTEM_USER_ID)
                                    console.log(`Permission ${permission} granted to Role Moderator`)
                                } else {
                                    if (!user_initiated_models) {
                                        await upsertRolePermission(admin_role_id, existing_permission.id, SYSTEM_USER_ID)
                                        console.log(`Permission ${permission} granted to Role Admin`)
                                    }
                                }
                            }
                        }
                    }
                }
                break
        }
    }
}
