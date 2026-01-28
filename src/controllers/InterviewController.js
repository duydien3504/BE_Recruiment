const InterviewService = require('../services/InterviewService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');
const Joi = require('joi');

class InterviewController {
    /**
     * Create interview
     * @route POST /api/v1/interviews
     */
    async createInterview(req, res, next) {
        try {
            // Validation
            const schema = Joi.object({
                applicationId: Joi.number().required(),
                interview_time: Joi.date().iso().required(),
                type: Joi.string().valid('Online', 'Offline').required(),
                location: Joi.string().allow('', null),
                meeting_link: Joi.string().allow('', null),
                note: Joi.string().allow('', null)
            });

            const { error } = schema.validate(req.body);
            if (error) {
                const err = new Error(error.details[0].message);
                err.status = HTTP_STATUS.BAD_REQUEST;
                throw err;
            }

            const userId = req.user.userId;
            const interview = await InterviewService.createInterview(userId, req.body);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.CREATE_INTERVIEW_SUCCESS,
                data: interview
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update interview
     * @route PUT /api/v1/interviews/:id
     */
    async updateInterview(req, res, next) {
        try {
            // Validation
            const schema = Joi.object({
                interview_time: Joi.date().iso(),
                type: Joi.string().valid('Online', 'Offline'),
                location: Joi.string().allow('', null),
                meeting_link: Joi.string().allow('', null),
                note: Joi.string().allow('', null)
            });

            const { error } = schema.validate(req.body);
            if (error) {
                const err = new Error(error.details[0].message);
                err.status = HTTP_STATUS.BAD_REQUEST;
                throw err;
            }

            const userId = req.user.userId;
            const { id } = req.params;

            const updatedInterview = await InterviewService.updateInterview(userId, id, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_INTERVIEW_SUCCESS,
                data: updatedInterview
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cancel/Delete interview
     * @route DELETE /api/v1/interviews/:id
     */
    async cancelInterview(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            await InterviewService.cancelInterview(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.DELETE_INTERVIEW_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get interview detail
     * @route GET /api/v1/interviews/:id
     */
    async getInterviewDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const interview = await InterviewService.getInterviewDetail(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: 'Lấy chi tiết lịch phỏng vấn thành công.',
                data: interview
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get employer interviews
     * @route GET /api/v1/employer/interviews (Mapped via another route file or here? Plan says /api/v1/employer/interviews but usually grouped by resource. Let's put in InterviewController and map in employerRoutes or interviewRoutes with prefix. User requested /api/v1/employer/interviews, but context is interview module. Let's separate controller method first.)
     * Wait, plan says "58. Danh sách lịch phỏng vấn (Employer) - GET /api/v1/employer/interviews". This route structure implies strictly under /employer router.
     */
    async getEmployerInterviews(req, res, next) {
        try {
            const userId = req.user.userId;

            const interviews = await InterviewService.getEmployerInterviews(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_UPCOMING_INTERVIEWS_SUCCESS,
                data: interviews
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get candidate interviews
     * @route GET /api/v1/candidate/interviews
     */
    async getCandidateInterviews(req, res, next) {
        try {
            const userId = req.user.userId;

            const interviews = await InterviewService.getCandidateInterviews(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_UPCOMING_INTERVIEWS_SUCCESS, // Can reuse or create new message if distinct
                data: interviews
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new InterviewController();
