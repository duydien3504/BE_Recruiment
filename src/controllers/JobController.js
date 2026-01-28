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
    /**
     * Cập nhật tin tuyển dụng
     * @route PUT /api/v1/jobs/:id
     */
    async updateJob(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const updateData = req.body;

            const updatedJob = await JobService.updateJob(userId, id, updateData);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_JOB_SUCCESS,
                data: updatedJob
            });
        } catch (error) {
            next(error);
        }
    }
    /**
     * Xóa mềm tin tuyển dụng
     * @route DELETE /api/v1/jobs/:id
     */
    async deleteJob(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            await JobService.deleteJob(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.DELETE_JOB_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật trạng thái tin tuyển dụng
     * @route PATCH /api/v1/jobs/:id/status
     */
    async updateJobStatus(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { status } = req.body;

            const updatedJob = await JobService.updateJobStatus(userId, id, status);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_JOB_STATUS_SUCCESS,
                data: updatedJob
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách tin của tôi (Employer)
     * @route GET /api/v1/employer/jobs
     */
    async getMyJobs(req, res, next) {
        try {
            const userId = req.user.userId;
            const query = req.query;

            const jobs = await JobService.getMyJobs(userId, query);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_MY_JOBS_SUCCESS,
                data: jobs
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy chi tiết tin của tôi (Employer)
     * @route GET /api/v1/employer/jobs/:id
     */
    async getMyJobDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const job = await JobService.getMyJobDetail(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_MY_JOB_DETAIL_SUCCESS,
                data: job
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách tin chờ duyệt (Admin)
     * @route GET /api/v1/admin/jobs/pending
     */
    async getPendingJobs(req, res, next) {
        try {
            const jobs = await JobService.getPendingJobs(req.query);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_PENDING_JOBS_SUCCESS,
                data: jobs
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Duyệt tin tuyển dụng (Admin)
     * @route PATCH /api/v1/admin/jobs/:id/approve
     */
    async approveJob(req, res, next) {
        try {
            const { id } = req.params;

            await JobService.approveJob(id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.APPROVE_JOB_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Từ chối tin tuyển dụng (Admin)
     * @route PATCH /api/v1/admin/jobs/:id/reject
     */
    async rejectJob(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            await JobService.rejectJob(id, reason);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.REJECT_JOB_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy tất cả tin tuyển dụng (Admin)
     * @route GET /api/v1/admin/jobs
     */
    async getAllJobs(req, res, next) {
        try {
            const jobs = await JobService.getAllJobs(req.query);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_ALL_JOBS_SUCCESS,
                data: jobs
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Gợi ý việc làm AI (Candidate)
     * @route GET /api/v1/jobs/suggested
     */
    async getSuggestedJobs(req, res, next) {
        try {
            // Check authentication (middleware should guarantee user exists if used correctly)
            const userId = req.user.userId;

            const result = await JobService.getSuggestedJobs(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: 'Gợi ý việc làm thành công',
                data: result.data
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new JobController();
