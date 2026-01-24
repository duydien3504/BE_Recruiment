const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { connectDB } = require('./config/database');

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging request

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Recruitment System API',
        docs: '/api-docs'
    });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Lỗi server nội bộ';

    // Log error (có thể mở rộng log ra file)
    console.error(`[Lỗi] ${statusCode} - ${message}`);

    res.status(statusCode).json({
        error: {
            code: statusCode,
            message: message
        }
    });
});

module.exports = app;
