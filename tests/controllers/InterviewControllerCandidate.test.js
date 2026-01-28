const InterviewController = require('../../src/controllers/InterviewController');
const InterviewService = require('../../src/services/InterviewService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/InterviewService');

const req = {
    user: { userId: 'user-123' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('InterviewController.getCandidateInterviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and interview list', async () => {
        const mockInterviews = [{ id: 1 }];
        InterviewService.getCandidateInterviews.mockResolvedValue(mockInterviews);

        await InterviewController.getCandidateInterviews(req, res, next);

        expect(InterviewService.getCandidateInterviews).toHaveBeenCalledWith('user-123');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_UPCOMING_INTERVIEWS_SUCCESS,
            data: mockInterviews
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        InterviewService.getCandidateInterviews.mockRejectedValue(error);

        await InterviewController.getCandidateInterviews(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
