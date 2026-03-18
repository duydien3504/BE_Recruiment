const { sequelize } = require('../config/database');
const InterviewQuestionRepository = require('../repositories/InterviewQuestionRepository');
const ApplicationRepository = require('../repositories/ApplicationRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const AIService = require('./AIService');
const { extractTextFromPdfUrl } = require('../utils/pdfExtractor');

class InterviewQuestionService {
    async generateInterviewQuestions(applicationId, employerUserId, forceRegenerate) {
        // 1. Fetch application detail
        const application = await ApplicationRepository.findDetailById(applicationId);
        if (!application) {
            const error = new Error('Application ID not found');
            error.statusCode = 404;
            throw error;
        }

        // 2. Validate permission
        const employerCompany = await CompanyRepository.findOne({ userId: employerUserId });
        if (!employerCompany || application.jobPost.companyId !== employerCompany.companyId) {
            const error = new Error('You do not have permission to access this application');
            error.statusCode = 403;
            throw error;
        }

        // 3. Check existing questions
        let existingQuestions = await InterviewQuestionRepository.findByApplicationId(applicationId);
        if (existingQuestions && existingQuestions.length > 0) {
            if (!forceRegenerate) {
                return existingQuestions; // return cached result from DB
            }
        }

        // 4. Extract JD
        const jdText = `
Title: ${application.jobPost.title || ''}
Description: ${application.jobPost.description || ''}
Requirements: ${application.jobPost.requirements || ''}
        `.trim();

        // 5. Extract CV
        const resumeUrl = application.resume ? application.resume.fileUrl : null;
        if (!resumeUrl) {
            const error = new Error('Candidate CV is missing or invalid');
            error.statusCode = 400;
            throw error;
        }

        let cvText = '';
        try {
            cvText = await extractTextFromPdfUrl(resumeUrl);
        } catch (err) {
            const error = new Error('Failed to read Candidate CV');
            error.statusCode = 400;
            throw error;
        }

        if (!cvText || cvText.trim().length === 0) {
            const error = new Error('Candidate CV is empty after extraction');
            error.statusCode = 400;
            throw error;
        }

        // 6. Call AI Service
        const generatedData = await AIService.generateInterviewQuestions(cvText, jdText);

        const questionsToInsert = generatedData.map(q => ({
            applicationId: applicationId,
            questionContent: q.content,
            expectedAnswer: q.expected_answer
        }));

        // 7. Save to DB using Transaction
        const transaction = await sequelize.transaction();
        try {
            if (existingQuestions.length > 0) {
                await InterviewQuestionRepository.deleteByApplicationId(applicationId, transaction);
            }
            await InterviewQuestionRepository.bulkCreateQuestions(questionsToInsert, transaction);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Database transaction failed: ${error.message}`);
        }

        // 8. Return newly created questions
        return await InterviewQuestionRepository.findByApplicationId(applicationId);
    }
}

module.exports = new InterviewQuestionService();
