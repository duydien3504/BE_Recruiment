const SavedJobController = require('../../src/controllers/SavedJobController');
const SavedJobService = require('../../src/services/SavedJobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/SavedJobService');

const req = {
    user: { userId: 'user-123' },
    body: { jobPostId: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('SavedJobController.saveJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and success message', async () => {
        SavedJobService.saveJob.mockResolvedValue({ userId: 'user-123', jobPostId: 1 });

        await SavedJobController.saveJob(req, res, next);

        expect(SavedJobService.saveJob).toHaveBeenCalledWith('user-123', 1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.SAVE_JOB_SUCCESS
        });
    });

    it('should throw BAD_REQUEST if jobPostId is missing', async () => {
        const invalidReq = { ...req, body: {} };
        await SavedJobController.saveJob(invalidReq, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        SavedJobService.saveJob.mockRejectedValue(error);

        await SavedJobController.saveJob(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
