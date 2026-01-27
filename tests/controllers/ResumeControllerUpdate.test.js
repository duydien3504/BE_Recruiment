const ResumeController = require('../../src/controllers/ResumeController');
const ResumeService = require('../../src/services/ResumeService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ResumeService');

const req = {
    user: { userId: 'user-123' },
    params: { id: 1 },
    file: { originalname: 'NewCV.pdf' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ResumeController.updateResume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and updated resume', async () => {
        const mockResume = { resumesId: 1, fileName: 'NewCV.pdf' };
        ResumeService.updateResume.mockResolvedValue(mockResume);

        await ResumeController.updateResume(req, res, next);

        expect(ResumeService.updateResume).toHaveBeenCalledWith('user-123', 1, req.file);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UPDATE_RESUME_SUCCESS,
            data: mockResume
        });
    });

    it('should throw error if no file provided', async () => {
        const reqNoFile = { user: { userId: 'user-123' }, params: { id: 1 } };

        await ResumeController.updateResume(reqNoFile, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ResumeService.updateResume.mockRejectedValue(error);

        await ResumeController.updateResume(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
