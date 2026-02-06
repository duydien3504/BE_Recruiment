const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tuyển Dụng API Documentation',
            version: '1.0.0',
            description: 'API documentation for Recruitment System',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'be-recruitment.onrender.com'}`
                    : `http://localhost:${process.env.PORT || 8080}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        path.join(__dirname, '../routes/*.js'),
        path.join(__dirname, '../controllers/*.js'),
        path.join(__dirname, '../../API_DESIGN_PLAN.md') // Tạm thời link vào design plan nếu chưa có JSDoc trong code
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
