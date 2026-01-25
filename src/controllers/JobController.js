const JobService = require('../services/JobService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class JobController {
    /**
     * Tìm kiếm việc làm
     * @route GET /api/v1/jobs
     */
    async getJobs(req, res, next) {
        try {
            const result = await JobService.getJobs(req.query);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_JOBS_SUCCESS,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xem chi tiết việc làm
     * @route GET /api/v1/jobs/:id
     */
    async getJobDetail(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user ? req.user.userId : null;

            const job = await JobService.getJobDetail(id, userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_JOB_DETAIL_SUCCESS,
                data: job
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Tạo tin tuyển dụng
     * @route POST /api/v1/jobs
     */
    async createJob(req, res, next) {
        try {
            const userId = req.user.userId;
            let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
            // Convert IPv6 localhost to IPv4
            if (ipAddr === '::1') ipAddr = '127.0.0.1';

            const result = await JobService.createJob(userId, req.body, ipAddr);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.CREATE_JOB_SUCCESS,
                data: {
                    jobPostId: result.job.jobPostId,
                    status: result.job.status,
                    paymentUrl: result.paymentUrl,
                    amount: result.amount
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new JobController();
