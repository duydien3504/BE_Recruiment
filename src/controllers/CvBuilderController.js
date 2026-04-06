const CvBuilderService = require('../services/CvBuilderService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');

class CvBuilderController {
    /**
     * Lấy bản nháp CV của user đang đăng nhập.
     * @route GET /api/v1/cv-builder
     * @access Candidate only
     */
    async getCvDraft(req, res, next) {
        try {
            const { userId } = req.user;

            const data = await CvBuilderService.getCvDraft(userId);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.GET_CV_BUILDER_SUCCESS,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật / Auto-save bản nháp CV.
     * @route PUT /api/v1/cv-builder
     * @access Candidate only
     */
    async updateCvDraft(req, res, next) {
        try {
            const { userId } = req.user;
            const payload = req.body;

            const result = await CvBuilderService.updateCvDraft(userId, payload);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.UPDATE_CV_BUILDER_SUCCESS,
                newAtsScore: result.newAtsScore
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Tự động lấy & đồng bộ dữ liệu từ hồ sơ (Auto-Fill Profile Data)
     * @route GET /api/v1/cv-builder/auto-fill
     * @access Candidate only
     */
    async autoFillProfile(req, res, next) {
        try {
            const { userId } = req.user;

            const data = await CvBuilderService.autoFillProfile(userId);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Ánh xạ dữ liệu Profile thành công.",
                data
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách thư viện template CV
     * @route GET /api/v1/cv-builder/templates
     * @access Public
     */
    async getTemplates(req, res, next) {
        try {
            const { industry } = req.query;

            const data = await CvBuilderService.getTemplates(industry);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.GET_TEMPLATES_SUCCESS,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Gợi ý nội dung CV bằng AI (Smart Filling / Suggestion)
     * @route POST /api/v1/cv-builder/ai-suggest
     * @access Candidate only
     */
    async generateAiSuggestion(req, res, next) {
        try {
            const payload = req.body;

            const suggestions = await CvBuilderService.generateAiSuggestion(payload);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.AI_SUGGESTION_SUCCESS,
                data: {
                    suggestions
                }
            });
        } catch (error) {
            // Forward tới Global Error Handler
            if (error.message && (error.message.includes('Timeout') || error.message.includes('timeout'))) {
                error.status = 504;
                error.message = MESSAGES.AI_SUGGESTION_TIMEOUT;
            } else {
                error.status = error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
            }
            next(error);
        }
    }

    /**
     * Kiểm tra độ khớp chuẩn ATS của CV so với JD
     * @route POST /api/v1/cv-builder/ats-check
     * @access Candidate only
     */
    async checkAtsMatch(req, res, next) {
        try {
            const { cvText, jdText } = req.body;

            const data = await CvBuilderService.checkAtsMatch(cvText, jdText);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.ATS_CHECK_SUCCESS,
                data
            });
        } catch (error) {
            if (error.message && (error.message.includes('Timeout') || error.message.includes('timeout'))) {
                error.status = 504;
                error.message = MESSAGES.AI_SUGGESTION_TIMEOUT;
            } else if (error.message && error.message.includes('phân mảnh')) {
                error.status = HTTP_STATUS.BAD_REQUEST; // Lỗi do dữ liệu xử lý không thành công
            } else {
                error.status = error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
            }
            next(error);
        }
    }

    /**
     * Xuất file CV PDF trả về HTTP file stream
     * @route POST /api/v1/cv-builder/export
     * @access Candidate only
     */
    async exportCvPdf(req, res, next) {
        try {
            const { userId } = req.user;
            const payload = req.body;
            
            const pdfBuffer = await CvBuilderService.exportCvDraft(userId, payload);

            // Ghi cấu hình Header yêu cầu browser tải về file chứ không phải parse json
            res.setHeader('Content-Type', 'application/pdf');
            // Cấu hình attachment tải thẳng với tên mặc định. Có thể fetch tên user ném vào file name sau.
            res.setHeader('Content-Disposition', 'attachment; filename=Resume-Export.pdf');
            
            // Xả buffer (stream raw data) về client trực tiếp 
            return res.send(pdfBuffer);
            
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CvBuilderController();
