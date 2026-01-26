const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/JobService');

const req = {
    params: { id: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('JobController.approveJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        JobService.approveJob.mockResolvedValue({ status: 'Active' });

        await JobController.approveJob(req, res, next);

        expect(JobService.approveJob).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.APPROVE_JOB_SUCCESS
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        JobService.approveJob.mockRejectedValue(error);

        await JobController.approveJob(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
