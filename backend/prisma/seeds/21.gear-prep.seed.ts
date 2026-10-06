import { prisma } from './seed-client'

import { SYSTEM_USER_ID, MEDIA_PATH_PREFIX } from '../../src/constants/macros'

export async function seedGearPrep() {
    // Brand
    const osprey = await prisma.brand.upsert({
        where: { name: 'Osprey' },
        update: {},
        create: {
            name: 'Osprey',
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/Osprey-logo.png`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const sea_to_summit = await prisma.brand.upsert({
        where: { name: 'Sea To Summit' },
        update: {},
        create: {
            name: 'Sea To Summit',
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/Sea-to-summit-logo.png`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const montbell = await prisma.brand.upsert({
        where: { name: 'Montbell' },
        update: {},
        create: {
            name: '',
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/Montbell-logo.webp`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const macpac = await prisma.brand.upsert({
        where: { name: 'Macpac' },
        update: {},
        create: {
            name: '',
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/macpac-logo.jpg`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const merrell = await prisma.brand.upsert({
        where: { name: 'Merrell' },
        update: {},
        create: {
            name: '',
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/Merrell-Logo.png`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })

    // GearType
    const tent = await prisma.gearType.upsert({
        where: { name: 'Tent' },
        update: {},
        create: {
            name: 'Tent',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const sleeping_bag = await prisma.gearType.upsert({
        where: { name: 'Sleeping Bag' },
        update: {},
        create: {
            name: 'Sleeping Bag',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const sleeping_mat = await prisma.gearType.upsert({
        where: { name: 'Sleeping Mat' },
        update: {},
        create: {
            name: 'Sleeping Mat',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const sleeping_bag_liner = await prisma.gearType.upsert({
        where: { name: 'Sleeping Bag Liner' },
        update: {},
        create: {
            name: 'Sleeping Bag Liner',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const pillow = await prisma.gearType.upsert({
        where: { name: 'Pillow' },
        update: {},
        create: {
            name: 'Pillow',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const packs = await prisma.gearType.upsert({
        where: { name: 'Packs' },
        update: {},
        create: {
            name: 'Packs',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
        },
    })
    const backpack = await prisma.gearType.upsert({
        where: { name: 'Backpack' },
        update: {},
        create: {
            name: 'Backpack',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
            parent_gear_type_id: packs.id,
        },
    })
    const daypack = await prisma.gearType.upsert({
        where: { name: 'Daypack' },
        update: {},
        create: {
            name: 'Daypack',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
            parent_gear_type_id: backpack.id,
        },
    })
    const trekking_pack = await prisma.gearType.upsert({
        where: { name: 'Trekking Pack' },
        update: {},
        create: {
            name: 'Trekking Pack',
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID,
            parent_gear_type_id: backpack.id,
        },
    })

    // GearTags

    // GearSpecsDefinition
}
