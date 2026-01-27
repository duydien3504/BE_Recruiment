const ApplicationService = require('../services/ApplicationService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');

class ApplicationController {
    /**
     * Apply for a job
     * @route POST /api/v1/applications
     */
    async applyJob(req, res, next) {
        try {
            const userId = req.user.userId;
            const { jobPostId, resumesId, cover_letter } = req.body;

            if (!jobPostId || !resumesId) {
                const error = new Error('Job Post ID và Resume ID là bắt buộc.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            const data = {
                jobPostId,
                resumesId,
                coverLetter: cover_letter
            };

            await ApplicationService.createApplication(userId, data);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.APPLY_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get candidate application history
     * @route GET /api/v1/candidate/applications
     */
    async getCandidateHistory(req, res, next) {
        try {
            const userId = req.user.userId;
            const applications = await ApplicationService.getCandidateApplications(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_APPLICATION_HISTORY_SUCCESS,
                data: applications
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get application detail
     * @route GET /api/v1/candidate/applications/:id
     */
    async getApplicationDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const application = await ApplicationService.getApplicationDetail(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_APPLICATION_DETAIL_SUCCESS,
                data: application
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get applications for a job (Employer)
     * @route GET /api/v1/employer/applications/job/:jobId
     */
    async getJobApplications(req, res, next) {
        try {
            const userId = req.user.userId;
            const { jobId } = req.params;

            const applications = await ApplicationService.getJobApplications(userId, jobId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_JOB_APPLICATIONS_SUCCESS,
                data: applications
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get application detail (Employer)
     * @route GET /api/v1/employer/applications/:id
     */
    async getEmployerApplicationDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const application = await ApplicationService.getEmployerApplicationDetail(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_APPLICATION_DETAIL_SUCCESS,
                data: application
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update application status (Employer)
     * @route PATCH /api/v1/employer/applications/:id/status
     */
    async updateApplicationStatus(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { status, note } = req.body;

            if (!status) {
                const error = new Error('Status là bắt buộc.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            await ApplicationService.updateApplicationStatus(userId, id, status, note);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_APPLICATION_STATUS_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ApplicationController();
