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

// API Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const employerRoutes = require('./routes/employerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const followRoutes = require('./routes/followRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/employer', employerRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/saved-jobs', savedJobRoutes);
app.use('/api/v1/follows', followRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/candidate', candidateRoutes);
app.use('/api/v1/interviews', interviewRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/v1/notifications', notificationRoutes);

const conversationRoutes = require('./routes/conversationRoutes');
app.use('/api/v1/conversations', conversationRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/v1/messages', messageRoutes);


const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/v1/categories', categoryRoutes);

const locationRoutes = require('./routes/locationRoutes');
app.use('/api/v1/locations', locationRoutes);

const skillRoutes = require('./routes/skillRoutes');
app.use('/api/v1/skills', skillRoutes);

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
