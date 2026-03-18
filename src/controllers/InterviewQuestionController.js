const InterviewQuestionService = require('../services/InterviewQuestionService');

class InterviewQuestionController {
    /**
     * POST /api/v1/employer/applications/:applicationId/generate-interview-questions
     */
    async generateQuestions(req, res, next) {
        try {
            // Validated params come from validateGenerateQuestions middleware
            const applicationId = req.validatedParams.applicationId;
            const forceRegenerate = req.validatedParams.force_regenerate || false;
            const employerUserId = req.user.userId;

            const questions = await InterviewQuestionService.generateInterviewQuestions(applicationId, employerUserId, forceRegenerate);

            return res.status(200).json({
                status: 200,
                message: "Generate interview questions successfully.",
                data: {
                    applicationId: applicationId,
                    questions: questions
                }
            });
        } catch (error) {
            console.error('[InterviewQuestionController]', error.message);
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Internal server error while generating questions'
            });
        }
    }
}

module.exports = new InterviewQuestionController();
