const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/JobService');

const req = {
    params: { id: 1 },
    body: { reason: 'Violation' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('JobController.rejectJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        JobService.rejectJob.mockResolvedValue({ status: 'Rejected' });

        await JobController.rejectJob(req, res, next);

        expect(JobService.rejectJob).toHaveBeenCalledWith(1, 'Violation');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.REJECT_JOB_SUCCESS
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        JobService.rejectJob.mockRejectedValue(error);

        await JobController.rejectJob(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
