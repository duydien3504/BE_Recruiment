const InterviewQuestionController = require('../../src/controllers/InterviewQuestionController');
const InterviewQuestionService = require('../../src/services/InterviewQuestionService');

jest.mock('../../src/services/InterviewQuestionService');

const buildRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('InterviewQuestionController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateQuestions', () => {
        it('should successfully return generated questions', async () => {
            const req = {
                validatedParams: { applicationId: 1, force_regenerate: false },
                user: { userId: 'emp-123' }
            };
            const res = buildRes();
            const next = jest.fn();

            const mockQuestions = [{ id: 1, content: 'Q1' }];
            InterviewQuestionService.generateInterviewQuestions.mockResolvedValue(mockQuestions);

            await InterviewQuestionController.generateQuestions(req, res, next);

            expect(InterviewQuestionService.generateInterviewQuestions).toHaveBeenCalledWith(1, 'emp-123', false);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                message: "Generate interview questions successfully.",
                data: {
                    applicationId: 1,
                    questions: mockQuestions
                }
            });
        });

        it('should handle service errors gracefully', async () => {
            const req = {
                validatedParams: { applicationId: 1, force_regenerate: true },
                user: { userId: 'emp-123' }
            };
            const res = buildRes();
            const next = jest.fn();

            const mockError = new Error('Application ID not found');
            mockError.statusCode = 404;
            InterviewQuestionService.generateInterviewQuestions.mockRejectedValue(mockError);

            await InterviewQuestionController.generateQuestions(req, res, next);

            expect(InterviewQuestionService.generateInterviewQuestions).toHaveBeenCalledWith(1, 'emp-123', true);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Application ID not found'
            });
        });

        it('should handle generic 500 errors gracefully', async () => {
            const req = {
                validatedParams: { applicationId: 1, force_regenerate: false },
                user: { userId: 'emp-123' }
            };
            const res = buildRes();
            const next = jest.fn();

            const mockError = new Error('Some DB weird error');
            InterviewQuestionService.generateInterviewQuestions.mockRejectedValue(mockError);

            await InterviewQuestionController.generateQuestions(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Some DB weird error'
            });
        });
    });
});
