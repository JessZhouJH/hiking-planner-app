import { prisma } from './seed-client'
import { findGearFeatureByFksAndTitleDescription } from '../../src/services/gear/gear_feature.service'
import { upsertGearTagRelationData } from '../../src/services/gear/gear_tag_relation.service'
export async function seedGearDetails() {}
