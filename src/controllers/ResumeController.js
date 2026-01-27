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

    /**
     * Lấy danh sách CV
     * @route GET /api/v1/resumes
     */
    async getMyResumes(req, res, next) {
        try {
            const userId = req.user.userId;

            const resumes = await ResumeService.getMyResumes(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_MY_RESUMES_SUCCESS,
                data: resumes
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xem chi tiết CV
     * @route GET /api/v1/resumes/:id
     */
    async getResumeDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const resume = await ResumeService.getResumeDetail(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_RESUME_DETAIL_SUCCESS,
                data: resume
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật CV (Thay thế file)
     * @route PUT /api/v1/resumes/:id
     */
    async updateResume(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const file = req.file;

            if (!file) {
                const error = new Error(MESSAGES.RESUME_FILE_REQUIRED);
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            const updatedResume = await ResumeService.updateResume(userId, id, file);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_RESUME_SUCCESS,
                data: updatedResume
            });
        } catch (error) {
            next(error);
        }
    }
    /**
     * Set main resume
     * @route PATCH /api/v1/resumes/:id/set-main
     */
    async setMainResume(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            await ResumeService.setMainResume(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.SET_MAIN_RESUME_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ResumeController();
