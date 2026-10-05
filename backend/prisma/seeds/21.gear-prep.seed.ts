import { prisma } from "./seed-client"

import { SYSTEM_USER_ID, MEDIA_PATH_PREFIX } from "../../src/constants/macros"

export async function seedGearPrep() {
    // Brand
    const osprey = await prisma.brand.upsert({
        where:{name: "Osprey"},
        update:{},
        create:{
            name: "Osprey",
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/Osprey-logo.png`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID
        }
    })
    const sea_to_summit = await prisma.brand.upsert({
        where: {name: "Sea To Summit"},
        update: {},
        create: {
            name: "Sea To Summit",
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/Sea-to-summit-logo.png`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID
        }
    })
    const montbell = await prisma.brand.upsert({
        where: {name: "Montbell"},
        update: {},
        create: {
            name: "",
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/Montbell-logo.webp`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID
        }
    })
    const macpac = await prisma.brand.upsert({
        where: {name: "Macpac"},
        update: {},
        create: {
            name: "",
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/macpac-logo.jpg`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID
        }
    })
    const merrell = await prisma.brand.upsert({
        where: {name: "Merrell"},
        update: {},
        create: {
            name: "",
            logo_img_key: `${MEDIA_PATH_PREFIX}/brand-logo/Merrell-Logo.png`,
            created_by_id: SYSTEM_USER_ID,
            updated_by_id: SYSTEM_USER_ID
        }
    })

    // GearType


    // GearTags


    // GearSpecsDefinition
}