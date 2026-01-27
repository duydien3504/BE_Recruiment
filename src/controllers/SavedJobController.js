const SavedJobService = require('../services/SavedJobService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');

class SavedJobController {
    /**
     * Save job
     * @route POST /api/v1/saved-jobs
     */
    async saveJob(req, res, next) {
        try {
            const userId = req.user.userId;
            const { jobPostId } = req.body;

            if (!jobPostId) {
                const error = new Error('Job Post ID là bắt buộc.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            await SavedJobService.saveJob(userId, jobPostId);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.SAVE_JOB_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get saved jobs
     * @route GET /api/v1/saved-jobs
     */
    async getSavedJobs(req, res, next) {
        try {
            const userId = req.user.userId;
            const savedJobs = await SavedJobService.getSavedJobs(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_SAVED_JOBS_SUCCESS,
                data: savedJobs
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Unsave job
     * @route DELETE /api/v1/saved-jobs/:id
     */
    async unsaveJob(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            if (!id) {
                const error = new Error('ID jobPost là bắt buộc.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            await SavedJobService.unsaveJob(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UNSAVE_JOB_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SavedJobController();
