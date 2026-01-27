const ResumeController = require('../../src/controllers/ResumeController');
const ResumeService = require('../../src/services/ResumeService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ResumeService');

const req = {
    user: { userId: 'user-123' },
    params: { id: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ResumeController.setMainResume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        ResumeService.setMainResume.mockResolvedValue(true);

        await ResumeController.setMainResume(req, res, next);

        expect(ResumeService.setMainResume).toHaveBeenCalledWith('user-123', 1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.SET_MAIN_RESUME_SUCCESS
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ResumeService.setMainResume.mockRejectedValue(error);

        await ResumeController.setMainResume(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
