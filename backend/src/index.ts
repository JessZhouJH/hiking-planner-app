import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { globalErrorHandler } from './middleware/errorHandler.js'

// access control routes
import permissionRoutes from './routes/access-control/permission.routes.js'
import roleRoutes from './routes/access-control/role.routes.js'
import userRoutes from './routes/access-control/user.routes.js'
import rolePermissionRoutes from './routes/access-control/role-permission.routes.js'

// gear routes
import brandRoutes from './routes/gear/brand.routes.js'

// Load variables from ,env into process.env
dotenv.config()

// create express app
const app = express()

// allow frontend to call API during local development
app.use(cors())

// parse json request bodies
app.use(express.json())

// register routes
// access control routes
app.use('/api/permissions', permissionRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/users', userRoutes)
app.use('/api/rolePermissions', rolePermissionRoutes)

// gear routes
app.use('/api/brand', brandRoutes)

app.use(globalErrorHandler)

// basic server health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
    })
})

// start server
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
