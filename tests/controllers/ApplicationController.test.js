const ApplicationController = require('../../src/controllers/ApplicationController');
const ApplicationService = require('../../src/services/ApplicationService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ApplicationService');

const req = {
    user: { userId: 'user-123' },
    body: {
        jobPostId: 1,
        resumesId: 10,
        cover_letter: 'letter'
    }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ApplicationController.applyJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and success message', async () => {
        ApplicationService.createApplication.mockResolvedValue({ id: 1 });

        await ApplicationController.applyJob(req, res, next);

        expect(ApplicationService.createApplication).toHaveBeenCalledWith('user-123', {
            jobPostId: 1,
            resumesId: 10,
            coverLetter: 'letter'
        });
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.APPLY_SUCCESS
        });
    });

    it('should throw BAD_REQUEST if mandatory fields missing', async () => {
        const invalidReq = { ...req, body: {} };
        await ApplicationController.applyJob(invalidReq, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ApplicationService.createApplication.mockRejectedValue(error);

        await ApplicationController.applyJob(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
