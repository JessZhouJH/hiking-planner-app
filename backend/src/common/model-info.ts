export enum managedBy {
    USER,
    SYSTEM,
}
export type model = {
    name: string
    requiresReview: boolean
    permissions: string[]
    requiresOwner: boolean
}
export type module = {
    name: string
    models: model[]
    managedBy: managedBy
}

export enum ROLE_TYPES {
    ADMIN,
    MODERATOR,
    USER
}

export const GENERAL_ACCESS = ['create', 'read', 'update', 'delete']
export const VERIFICATION_ACCESS = 'verify'
export const EXPORT_ACCESS = 'export'

export enum ACTION_TYPES {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    VERIFY = 'verify',
    EXPORT = 'export',
}

export const VERIFY_MODEL_NAMES: string[] = [
    'MediaArchive',
    'Attachment',

    'Gear',
    'GearPack',
    'DescriptiveGear',

    'Challenge',
    'Trail',
    'TrailDifficulty',
    'TrailFacility',
    'TrailFacilityRelation',
    'TrailProfile',
    'AccessPoint',
    'TrailAccessPointRelation',
    'TrailGeometry',
    'TrailSegmentation',
    'TrailSegmentRelation',
    'TransportService',
    'TrailTransportService',

    'MealPack',

    'Collection',
    'CollectionItem',
    'UserFeedback',
    'UserProposal',
    'CommunityPublication',
    'CommunityPublicationItem',
    'CommunityPublicationAttachment',
    'RecordAction',
    'ContentReviewHistory',
]
export const USER_MANAGED_MODULES: string[] = ['Trip', 'Personal']

export const OWNER_REQUIRED_MODELS: string[] = [
    'Gear',
    'DescriptiveGear',
    'GearPack',
    'Trail',
    'TrailProfile',
    'AccessPoint',
    'TrailGeometry',
    'TrailSegmentation',
    'MealPack',
    'MealItem',
    'Colleciton',

]

export const ACCESS_CONTROL_MODULE_MODELS = [
    'User',
    'Role',
    'Permission',
    'UserRole',
    'RolePermission',
]
export const COMMON_MODULE_MODELS = [
    'Alias',
    'MediaArchive',
    'Attachment',
    'Unit',
    'Tag',
    'TagRelation',
    'TagGroup',
    'TagGroupRelation',
]
export const GEAR_MODULE_MODELS = [
    'Brand',
    'GearType',
    'GearTypeRelation',
    'GearSpecsDefinition',
    'Gear',
    'DescriptiveGear',
    'GearTagRelation',
    'GearSpecs',
    'GearFeature',
    'GearVariant',
    'GearPack',
    'GearPackTemplate',
    'GearPackComponent',
]
export const TRAIL_MODULE_MODELS = [
    'Challenge',
    'ChallengeGearRequirement',
    'DifficultySystem',
    'DifficultyMapping',
    'Trail',
    'TrailTagRelation',
    'TrailChallenge',
    'TrailCalendar',
    'TrailSource',
    'TrailGearRequirement',
    'TrailDifficulty',
    'TrailFacility',
    'TrailFacilityRelation',
    'TrailUse',
    'TrailProfile',
    'TrailProfileUse',
    'AccessPoint',
    'AccessPointCalendar',
    'TrailAccessPointRelation',
    'TrailGeometry',
    'TrailSegmentation',
    'TrailSegmentRelation',
    'TransportService',
    'TransportServiceCalendar',
    'TransportServiceStop',
    'TrailTransportService',
]
export const PERSONAL_MODULE_MODELS = [
    'UserTrail',
    'UserTrailCompletion',
    'UserGear',
    'UserGearPack',
    'UserGearPackItem',
    'UserPersonalArchive',
    'UserStickyNotes',
    'UserIdeaCapture',
]
export const TRIP_MODULE_MODELS = [
    'Trip',
    'TripAccommodation',
    'TripGearList',
    'TripMealPack',
    'TripMealPackItem',
    'TripTrail',
    'TripTransport',
    'CriticalEvent',
    'TripChecklist',
    'TripChecklistItem',
]
export const MEAL_MODULE_MODELS = ['MealPack', 'MealItem', 'MealPackItem']
export const COMMMUNITY_MODULE_MODELS = [
    'Collection',
    'CollectionItem',
    'UserFeedback',
    'UserProposal',
    'CommunityPublication',
    'CommunityPublicationItem',
    'CommunityPublicationAttachment',
    'RecordAction',
    'ContentReviewHistory',
]

export const SCHEMA_MODULES = [
    { name: 'AccessControl', models: ACCESS_CONTROL_MODULE_MODELS },
    { name: 'Common', models: COMMON_MODULE_MODELS },
    { name: 'Gear', models: GEAR_MODULE_MODELS },
    { name: 'Trail', models: TRAIL_MODULE_MODELS },
    { name: 'Personal', models: PERSONAL_MODULE_MODELS },
    { name: 'Trip', models: TRIP_MODULE_MODELS },
    { name: 'Meal', models: MEAL_MODULE_MODELS },
    { name: 'Community', models: COMMMUNITY_MODULE_MODELS },
]

export function generateModelInfo() {
    let modules: module[] = []
    for (var module of SCHEMA_MODULES) {
        let currentModuleModels: model[] = []
        for (var model of module.models) {
            let modelPermissions: string[] = []
            for (var access of GENERAL_ACCESS) {
                let currentPermission = `${model}.${access}`
                modelPermissions.push(currentPermission)
            }
            let requiresReview: boolean = VERIFY_MODEL_NAMES.indexOf(model) > -1
            let requiresOwner: boolean = OWNER_REQUIRED_MODELS.indexOf(model) > -1
            let currentModel: model = {
                name: model,
                requiresReview: requiresReview,
                permissions: modelPermissions,
                requiresOwner: requiresOwner
            }
            if (requiresReview) {
                currentModel.permissions.push(`${model}.verify`)
            }
            if (model === 'TrailGeometry') {
                currentModel.permissions.push(`${model}.export`)
            }
            currentModuleModels.push(currentModel)
        }
        let currentModule: module = {
            name: module.name,
            models: currentModuleModels,
            managedBy:
                USER_MANAGED_MODULES.indexOf(module.name) > -1
                    ? managedBy.USER
                    : managedBy.SYSTEM,
        }
        modules.push(currentModule)
    }
    return modules
}

export const MODEL_INFO = generateModelInfo()
