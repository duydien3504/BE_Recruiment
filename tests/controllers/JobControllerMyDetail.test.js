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

describe('JobController.getMyJobDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and job detail', async () => {
        const mockJob = { jobPostId: 1, title: 'Job A' };
        JobService.getMyJobDetail.mockResolvedValue(mockJob);

        await JobController.getMyJobDetail(req, res, next);

        expect(JobService.getMyJobDetail).toHaveBeenCalledWith(1, 1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_MY_JOB_DETAIL_SUCCESS,
            data: mockJob
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        JobService.getMyJobDetail.mockRejectedValue(error);

        await JobController.getMyJobDetail(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
