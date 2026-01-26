const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/JobService');

const req = {
    user: { userId: 1 },
    query: { status: 'Active' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('JobController.getMyJobs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and jobs list', async () => {
        const mockJobs = [{ jobPostId: 1, title: 'Job A' }];
        JobService.getMyJobs.mockResolvedValue(mockJobs);

        await JobController.getMyJobs(req, res, next);

        expect(JobService.getMyJobs).toHaveBeenCalledWith(1, req.query);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_MY_JOBS_SUCCESS,
            data: mockJobs
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        JobService.getMyJobs.mockRejectedValue(error);

        await JobController.getMyJobs(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
