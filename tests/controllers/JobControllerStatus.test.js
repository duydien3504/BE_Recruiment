const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/JobService');

const req = {
    user: { userId: 1 },
    params: { id: 1 },
    body: { status: 'Active' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('JobController.updateJobStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message when update success', async () => {
        const mockUpdatedJob = { jobPostId: 1, status: 'Active' };
        JobService.updateJobStatus.mockResolvedValue(mockUpdatedJob);

        await JobController.updateJobStatus(req, res, next);

        expect(JobService.updateJobStatus).toHaveBeenCalledWith(1, 1, 'Active');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UPDATE_JOB_STATUS_SUCCESS,
            data: mockUpdatedJob
        });
    });

    it('should call next with error when service throws error', async () => {
        const error = new Error('Some error');
        JobService.updateJobStatus.mockRejectedValue(error);

        await JobController.updateJobStatus(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
