import { prisma } from "./seed-client"

import { seedGearPrep } from "./21.gear-prep.seed"
import { seedGearPack } from "./22.gear-pack.seed"
import { seedGearDetails } from "./23.gear-details.seed"

export async function seedGear(){
    await seedGearPrep()
    await seedGearPack()
    await seedGearDetails()
}