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

describe('ResumeController.getResumeDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and resume detail', async () => {
        const mockResume = { resumesId: 1, fileUrl: 'link' };
        ResumeService.getResumeDetail.mockResolvedValue(mockResume);

        await ResumeController.getResumeDetail(req, res, next);

        expect(ResumeService.getResumeDetail).toHaveBeenCalledWith('user-123', 1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_RESUME_DETAIL_SUCCESS,
            data: mockResume
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ResumeService.getResumeDetail.mockRejectedValue(error);

        await ResumeController.getResumeDetail(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
