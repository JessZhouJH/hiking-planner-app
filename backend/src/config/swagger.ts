import swaggerJsdoc from "swagger-jsdoc"

const swagger_options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hiking Planner API",
            version: "1.0.0",
            description: "API documentation for Hiking Planner App"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server"
            }
        ]
    },

    apis: ["./src/**/*.ts"]
}

export const swagger_spec = swaggerJsdoc(swagger_options)