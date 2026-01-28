const InterviewController = require('../../src/controllers/InterviewController');
const InterviewService = require('../../src/services/InterviewService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/InterviewService');

const req = {
    user: { userId: 'user-123' },
    params: { id: 10 },
    body: { interview_time: '2024-02-05T10:00:00Z', note: 'Rescheduled' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('InterviewController.updateInterview', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        const mockUpdated = { id: 10, ...req.body };
        InterviewService.updateInterview.mockResolvedValue(true);

        await InterviewController.updateInterview(req, res, next);

        expect(InterviewService.updateInterview).toHaveBeenCalledWith('user-123', 10, req.body);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UPDATE_INTERVIEW_SUCCESS,
            data: true
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        InterviewService.updateInterview.mockRejectedValue(error);

        await InterviewController.updateInterview(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it('should allow partial updates', async () => {
        const partialReq = { ...req, body: { note: 'Only note' } };
        await InterviewController.updateInterview(partialReq, res, next);
        expect(InterviewService.updateInterview).toHaveBeenCalledWith('user-123', 10, partialReq.body);
    });
});
