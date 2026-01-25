const JobController = require('../../src/controllers/JobController');
const JobService = require('../../src/services/JobService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/JobService');

describe('JobController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            query: {},
            headers: {},
            connection: { remoteAddress: '127.0.0.1' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getJobs', () => {
        test('should return 200 and list of jobs', async () => {
            req.query = { page: 1, limit: 10 };
            const mockResult = {
                data: [],
                pagination: { total: 0 }
            };

            JobService.getJobs.mockResolvedValue(mockResult);

            await JobController.getJobs(req, res, next);

            expect(JobService.getJobs).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_JOBS_SUCCESS,
                ...mockResult
            });
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error('Service error');
            JobService.getJobs.mockRejectedValue(mockError);

            await JobController.getJobs(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getJobDetail', () => {
        test('should return 200 and job detail', async () => {
            req.params = { id: 1 };
            // Mock optional auth populating user
            req.user = { userId: 'uuid-123' };
            const mockJob = { id: 1, title: 'Java' };

            JobService.getJobDetail.mockResolvedValue(mockJob);

            await JobController.getJobDetail(req, res, next);

            expect(JobService.getJobDetail).toHaveBeenCalledWith(1, 'uuid-123');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_JOB_DETAIL_SUCCESS,
                data: mockJob
            });
        });

        test('should handle guest request', async () => {
            req.params = { id: 1 };
            req.user = undefined;
            const mockJob = { id: 1 };

            JobService.getJobDetail.mockResolvedValue(mockJob);

            await JobController.getJobDetail(req, res, next);

            expect(JobService.getJobDetail).toHaveBeenCalledWith(1, null);
        });

        test('should call next with error when service fails', async () => {
            req.params = { id: 1 };
            const mockError = new Error(MESSAGES.JOB_NOT_FOUND);
            JobService.getJobDetail.mockRejectedValue(mockError);

            await JobController.getJobDetail(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('createJob', () => {
        test('should return 201 with payment URL', async () => {
            req.user = { userId: 'user-uuid' };
            req.body = { title: 'Java Dev' };
            const mockResult = {
                job: { jobPostId: 1, status: 'Draft' },
                paymentUrl: 'https://vnpay.vn/pay',
                amount: 10000
            };

            JobService.createJob.mockResolvedValue(mockResult);

            await JobController.createJob(req, res, next);

            expect(JobService.createJob).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    paymentUrl: 'https://vnpay.vn/pay'
                })
            }));
        });
    });
});
