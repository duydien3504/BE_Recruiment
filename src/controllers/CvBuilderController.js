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
     * Hỗ trợ Optimistic Locking: nếu payload chứa `version`, server sẽ kiểm tra
     * xung đột trước khi lưu. Trả về 409 nếu phát hiện chồng lấn.
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
                newAtsScore: result.newAtsScore,
                newVersion: result.newVersion || undefined
            });
        } catch (error) {
            // Xử lý riêng lỗi xung đột phiên bản (Optimistic Lock Conflict)
            if (error.status === HTTP_STATUS.CONFLICT) {
                return res.status(HTTP_STATUS.CONFLICT).json({
                    success: false,
                    message: error.message
                });
            }
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
            const { category } = req.query;

            const data = await CvBuilderService.getTemplates(category);

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
     * Lấy HTML xem trước của CV
     * @route POST /api/v1/cv-builder/preview
     * @access Candidate only
     */
    async getPreview(req, res, next) {
        try {
            const { userId } = req.user;
            const payload = req.body;

            const html = await CvBuilderService.getPreviewHtml(userId, payload);

            return res.status(HTTP_STATUS.OK).send(html);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Trả về danh sách mẫu CV hoàn chỉnh theo chuyên ngành.
     * @route GET /api/v1/cv-builder/samples
     * @access Public
     */
    async getSampleCvData(req, res, next) {
        try {
            const { industry } = req.query;
            const data = CvBuilderService.getSampleCvData(industry || null);

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.GET_SAMPLE_CV_SUCCESS,
                total: data.length,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xuất file CV PDF.
     * - Cache Hit (CV chưa sửa): trả về JSON { downloadUrl } trỏ đến Cloudinary.
     * - Cache Miss (CV đã sửa hoặc lần đầu): render PDF mới và stream về client.
     * @route POST /api/v1/cv-builder/export
     * @access Candidate only
     */
    async exportCvPdf(req, res, next) {
        try {
            const { userId } = req.user;
            const payload = req.body;
            
            const result = await CvBuilderService.exportCvDraft(userId, payload);

            // Cache Hit: trả URL Cloudinary cho FE redirect tải
            if (result.type === 'url') {
                return res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: MESSAGES.EXPORT_CV_CACHED,
                    downloadUrl: result.url
                });
            }

            // Cache Miss: stream file PDF trực tiếp về browser
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=Resume-Export.pdf');
            
            return res.send(result.buffer);
            
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CvBuilderController();
