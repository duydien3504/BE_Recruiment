const ResumeController = require('../../src/controllers/ResumeController');
const ResumeService = require('../../src/services/ResumeService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ResumeService');

const req = {
    user: { userId: 'user-123' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ResumeController.getMyResumes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and list of resumes', async () => {
        const mockResumes = [{ resumesId: 1, fileName: 'CV.pdf' }];
        ResumeService.getMyResumes.mockResolvedValue(mockResumes);

        await ResumeController.getMyResumes(req, res, next);

        expect(ResumeService.getMyResumes).toHaveBeenCalledWith('user-123');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_MY_RESUMES_SUCCESS,
            data: mockResumes
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ResumeService.getMyResumes.mockRejectedValue(error);

        await ResumeController.getMyResumes(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
