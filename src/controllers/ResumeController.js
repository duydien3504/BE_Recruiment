const ResumeService = require('../services/ResumeService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');

class ResumeController {
    /**
     * Upload CV
     * @route POST /api/v1/resumes
     */
    async uploadResume(req, res, next) {
        try {
            const userId = req.user.userId;
            const file = req.file;

            if (!file) {
                const error = new Error('Vui lòng chọn file CV.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            const resume = await ResumeService.uploadResume(userId, file);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.UPLOAD_RESUME_SUCCESS,
                data: resume
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xóa CV
     * @route DELETE /api/v1/resumes/:id
     */
    async deleteResume(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            await ResumeService.deleteResume(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.DELETE_RESUME_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ResumeController();
