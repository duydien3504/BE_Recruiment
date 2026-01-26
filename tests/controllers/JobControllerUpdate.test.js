const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/JobService');

// Mock testUtils if it doesn't exist or just create simple mocks locally
const req = {
    user: { userId: 1 },
    params: { id: 1 },
    body: { title: 'New Title' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('JobController.updateJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and updated job when success', async () => {
        const mockUpdatedJob = { jobPostId: 1, title: 'New Title' };
        JobService.updateJob.mockResolvedValue(mockUpdatedJob);

        await JobController.updateJob(req, res, next);

        expect(JobService.updateJob).toHaveBeenCalledWith(1, 1, req.body);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UPDATE_JOB_SUCCESS,
            data: mockUpdatedJob
        });
    });

    it('should call next with error when service throws error', async () => {
        const error = new Error('Some error');
        JobService.updateJob.mockRejectedValue(error);

        await JobController.updateJob(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
