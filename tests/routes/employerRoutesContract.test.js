const request = require('supertest');
const express = require('express');

// Mock controllers used in employerRoutes
jest.mock('../../src/controllers/JobController', () => ({
    getMyJobs: jest.fn(),
    getMyJobDetail: jest.fn()
}));
jest.mock('../../src/controllers/ApplicationController', () => ({
    getJobApplications: jest.fn(),
    getEmployerApplications: jest.fn(),
    downloadEmployerApplicationCv: jest.fn(),
    getEmployerApplicationDetail: jest.fn(),
    updateApplicationStatus: jest.fn()
}));
jest.mock('../../src/controllers/CompanyController', () => ({
    getEmployerStatistics: jest.fn()
}));
jest.mock('../../src/controllers/InterviewController', () => ({
    getEmployerInterviews: jest.fn()
}));

jest.mock('../../src/controllers/InterviewQuestionController', () => ({
    generateQuestions: jest.fn((req, res) => res.status(200).json({ status: 200, message: "Generate interview questions successfully." }))
}));

// Mock middlewares
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => {
        req.user = { userId: 'emp-1' };
        next();
    },
    authorize: () => (req, res, next) => next()
}));

const employerRoutes = require('../../src/routes/employerRoutes');
const InterviewQuestionController = require('../../src/controllers/InterviewQuestionController');

describe('API Contract for Generate Interview Questions', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        // Map as it would be in server.js
        app.use('/api/v1/employer', employerRoutes);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully match POST route and reach controller', async () => {
        const response = await request(app)
            .post('/api/v1/employer/applications/10/generate-interview-questions')
            .send({ force_regenerate: true });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Generate interview questions successfully.");
        
        // Assert controller hit
        expect(InterviewQuestionController.generateQuestions).toHaveBeenCalled();
    });

    it('should return 400 when validation fails (invalid Application ID parameter)', async () => {
        const response = await request(app)
            .post('/api/v1/employer/applications/-5/generate-interview-questions')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        // Assert controller never hit
        expect(InterviewQuestionController.generateQuestions).not.toHaveBeenCalled();
    });
});
