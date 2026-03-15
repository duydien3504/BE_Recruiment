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
     * Cancel (delete) an application - Candidate only
     * @route DELETE /api/v1/applications/:applicationId
     */
    async cancelApplication(req, res, next) {
        try {
            const userId = req.user.userId;
            const { applicationId } = req.validatedParams;

            await ApplicationService.cancelApplication(applicationId, userId);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.CANCEL_APPLICATION_SUCCESS
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
     * Get paginated application list with optional status filter - Candidate only
     * @route GET /api/v1/candidate/applications/my-applications
     */
    async getMyApplications(req, res, next) {
        try {
            const userId = req.user.userId;
            const { status, page, limit } = req.validatedQuery;

            const data = await ApplicationService.getMyApplications(userId, { status, page, limit });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.GET_MY_APPLICATIONS_SUCCESS,
                data
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

    async getEmployerApplications(req, res, next) {
        try {
            const userId = req.user.userId;
            const data = await ApplicationService.getEmployerApplications(userId, req.validatedQuery);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.GET_JOB_APPLICATIONS_SUCCESS,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    async downloadEmployerApplicationCv(req, res, next) {
        try {
            const userId = req.user.userId;
            const { applicationId } = req.validatedParams;
            const data = await ApplicationService.downloadCvForEmployer(userId, applicationId);
            const encodedFileName = encodeURIComponent(data.fileName);

            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
            return res.status(HTTP_STATUS.OK).send(data.fileBuffer);
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
