const InterviewController = require('../../src/controllers/InterviewController');
const InterviewService = require('../../src/services/InterviewService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/InterviewService');

const req = {
    user: { userId: 'user-123' },
    body: {
        applicationId: 1,
        interview_time: '2024-02-01T10:00:00Z',
        type: 'Online',
        meeting_link: 'link'
    }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('InterviewController.createInterview', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and created interview', async () => {
        const mockInterview = { id: 1 };
        InterviewService.createInterview.mockResolvedValue(mockInterview);

        await InterviewController.createInterview(req, res, next);

        expect(InterviewService.createInterview).toHaveBeenCalledWith('user-123', req.body);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.CREATE_INTERVIEW_SUCCESS,
            data: mockInterview
        });
    });

    it('should call next with error when validation fails', async () => {
        const invalidReq = { ...req, body: {} }; // Missing required fields

        await InterviewController.createInterview(invalidReq, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        const error = next.mock.calls[0][0];
        expect(error.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        InterviewService.createInterview.mockRejectedValue(error);

        await InterviewController.createInterview(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
