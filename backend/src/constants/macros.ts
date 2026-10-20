export const SYSTEM_USER_ID = 1

export const MEDIA_PATH_PREFIX = 'backend/media'

type Status = {
    statusCode: number
    code: string
    message: string
}

const OK_STATUS: Status = {
    statusCode: 200,
    code: 'OK',
    message: 'Action successed.',
}
const CREATED_STATUS: Status = {
    statusCode: 200,
    code: 'CREATED',
    message: 'Successfully created the record.',
}
const BAD_REQUEST_STATUS: Status = {
    statusCode: 400,
    code: 'BAD_REQUET',
    message: 'Invalid request.',
}
const UNAUTHORIZED_STATUS: Status = {
    statusCode: 401,
    code: 'UNAUTHORIZED',
    message: 'Authentication is required.',
}
const FORBIDDEN_STATUS: Status = {
    statusCode: 403,
    code: 'FORBIDDEN',
    message: 'You do not have the permission to perform this action.',
}
const NOT_FOUND_STATUS: Status = {
    statusCode: 404,
    code: 'NOT_FOUND',
    message: 'The requested resource was not found.',
}
const CONFLICT_STATUS: Status = {
    statusCode: 409,
    code: 'CONFLICT',
    message: 'The request conflicts with the current state of the resource.',
}
const UNPROCESSABLE_CONTENT_STATUS: Status = {
    statusCode: 422,
    code: 'UNPROCESSABLE_CONTENT',
    message:
        'The request could not be processed due to business rule violations.',
}
const INTERNAL_SERVER_ERROR_STATUS: Status = {
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected server error occurred.',
}

export const STATUS_LIST = {
    OK_STATUS: OK_STATUS,
    CREATED_STATUS: CREATED_STATUS,
    BAD_REQUEST_STATUS: BAD_REQUEST_STATUS,
    UNAUTHORIZED_STATUS: UNAUTHORIZED_STATUS,
    FORBIDDEN_STATUS: FORBIDDEN_STATUS,
    NOT_FOUND_STATUS: NOT_FOUND_STATUS,
    CONFLICT_STATUS: CONFLICT_STATUS,
    UNPROCESSABLE_CONTENT_STATUS: UNPROCESSABLE_CONTENT_STATUS,
    INTERNAL_SERVER_ERROR_STATUS: INTERNAL_SERVER_ERROR_STATUS,
}
