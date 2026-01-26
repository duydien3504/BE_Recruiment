const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/JobService');

const req = {
    query: { status: 'Active' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('JobController.getAllJobs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and jobs list', async () => {
        const mockJobs = { count: 1, rows: [] };
        JobService.getAllJobs.mockResolvedValue(mockJobs);

        await JobController.getAllJobs(req, res, next);

        expect(JobService.getAllJobs).toHaveBeenCalledWith(req.query);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_ALL_JOBS_SUCCESS,
            data: mockJobs
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        JobService.getAllJobs.mockRejectedValue(error);

        await JobController.getAllJobs(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
