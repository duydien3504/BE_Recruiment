const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/JobService');

const req = {
    user: { userId: 1 },
    params: { id: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('JobController.deleteJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message when delete success', async () => {
        JobService.deleteJob.mockResolvedValue(true);

        await JobController.deleteJob(req, res, next);

        expect(JobService.deleteJob).toHaveBeenCalledWith(1, 1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.DELETE_JOB_SUCCESS
        });
    });

    it('should call next with error when service throws error', async () => {
        const error = new Error('Some error');
        JobService.deleteJob.mockRejectedValue(error);

        await JobController.deleteJob(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
