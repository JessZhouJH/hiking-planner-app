import { AppError } from '../common/error-handler.js'
import { ErrorRequestHandler } from 'express'
export const globalErrorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
            },
        })
        return
    }

    console.error(err)

    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected server error occurred.',
        },
    })
}
