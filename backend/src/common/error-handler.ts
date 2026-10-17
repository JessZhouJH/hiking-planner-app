import { prisma } from '../db/prisma.js'
import type { ErrorRequestHandler } from 'express'

// Validation / Auth / Forbidden / NotFound / Conflict / DomainRule / Internal
export class AppError extends Error {
    statusCode: number
    code: string

    constructor(statusCode: number, code: string, message: string) {
        super(message)

        this.statusCode = statusCode
        this.code = code
        this.name = code
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Invalid request.') {
        super(400, 'BAD_REQUEST', message)
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Authentication is required.') {
        super(401, 'UNAUTHORIZED', message)
    }
}

export class ForbiddenError extends AppError {
    constructor(
        message = 'You do not have the permission to perform this action.'
    ) {
        super(403, 'FORBIDDEN', message)
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'The requested resource was not found.') {
        super(404, 'NOT_FOUND', message)
    }
}

export class ConflictError extends AppError {
    constructor(
        message = 'The request conflicts with the current state of the resource.'
    ) {
        super(409, 'CONFLICT', message)
    }
}

export class UnprocessableContentError extends AppError {
    constructor(
        message = 'The request could not be processed due to business rule violations.'
    ) {
        super(422, 'UNPROCESSABLE_CONTENT', message)
    }
}

export class InternalServerError extends AppError {
    constructor(message = 'An unexpected server error occurred.') {
        super(500, 'INTERNAL_SERVER_ERROR', message)
    }
}

export const globalErrorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
            },
        })
        return
    }

    console.error(error)

    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected server error occurred.',
        },
    })
}
