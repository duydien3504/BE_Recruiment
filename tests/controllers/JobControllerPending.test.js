const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/JobService');

const req = {
    query: {}
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('JobController.getPendingJobs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and pending jobs list', async () => {
        const mockJobs = [{ jobPostId: 1, title: 'Job A' }];
        JobService.getPendingJobs.mockResolvedValue(mockJobs);

        await JobController.getPendingJobs(req, res, next);

        expect(JobService.getPendingJobs).toHaveBeenCalledWith(req.query);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_PENDING_JOBS_SUCCESS,
            data: mockJobs
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        JobService.getPendingJobs.mockRejectedValue(error);

        await JobController.getPendingJobs(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
