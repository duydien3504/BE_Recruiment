const ResumeController = require('../../src/controllers/ResumeController');
const ResumeService = require('../../src/services/ResumeService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ResumeService');

const req = {
    user: { userId: 'user-123' },
    file: {
        originalname: 'CV.pdf'
    }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ResumeController.uploadResume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and uploaded resume data', async () => {
        const mockResume = { resumesId: 1, fileName: 'CV.pdf' };
        ResumeService.uploadResume.mockResolvedValue(mockResume);

        await ResumeController.uploadResume(req, res, next);

        expect(ResumeService.uploadResume).toHaveBeenCalledWith('user-123', req.file);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UPLOAD_RESUME_SUCCESS,
            data: mockResume
        });
    });

    it('should throw error if no file provided', async () => {
        const reqNoFile = { user: { userId: 'user-123' } };

        await ResumeController.uploadResume(reqNoFile, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ResumeService.uploadResume.mockRejectedValue(error);

        await ResumeController.uploadResume(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
