const InterviewController = require('../../src/controllers/InterviewController');
const InterviewService = require('../../src/services/InterviewService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/InterviewService');

const req = {
    user: { userId: 'user-123' },
    params: { id: 10 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('InterviewController.cancelInterview', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        InterviewService.cancelInterview.mockResolvedValue(true);

        await InterviewController.cancelInterview(req, res, next);

        expect(InterviewService.cancelInterview).toHaveBeenCalledWith('user-123', 10);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.DELETE_INTERVIEW_SUCCESS
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        InterviewService.cancelInterview.mockRejectedValue(error);

        await InterviewController.cancelInterview(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
