const express = require('express');
const router = express.Router();
const CvBuilderController = require('../controllers/CvBuilderController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const cvBuilderValidator = require('../validators/cvBuilderValidator');

/**
 * @swagger
 * tags:
 *   name: CvBuilder
 *   description: Quản lý CV Builder (Tạo CV tích hợp AI)
 */

/**
 * @swagger
 * /api/v1/cv-builder/export:
 *   post:
 *     summary: Export CV ra file PDF
 *     tags: [CvBuilder]
 *     description: Trích xuất bản nháp CV hiện tại qua Puppeteer để tạo luồng tải về file format PDF (Render EJS html to Base64/Buffer PDF Stream).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về HTTP stream cho Browser tự động download file.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Không tìm thấy CV để export.
 *       500:
 *         description: Không đủ bộ nhớ RAM cho ứng dụng Puppeteer để headless Export.
 */
router.post(
    '/preview',
    authenticateToken,
    authorize(['Candidate']),
    CvBuilderController.getPreview
);

router.post(
    '/export',
    authenticateToken,
    authorize(['Candidate']),
    CvBuilderController.exportCvPdf
);

/**
 * @swagger
 * /api/v1/cv-builder/ai-suggest:
 *   post:
 *     summary: Sinh nội dung tự động bằng AI (Gợi ý chuyên biệt)
 *     tags: [CvBuilder]
 *     description: Sử dụng AI để sinh các nội dung dạng bullet-point (gạch đầu dòng) chuyên nghiệp.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - industry
 *               - section
 *             properties:
 *               industry:
 *                 type: string
 *                 example: "IT Backend"
 *               section:
 *                 type: string
 *                 example: "Kinh nghiệm làm việc"
 *               currentText:
 *                 type: string
 *                 example: "Tôi làm js 2 năm."
 *               keyword:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Trả về danh sách text suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tạo nội dung AI thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Lỗi thiếu Payload field
 *       504:
 *         description: Timer Timeout (Server LLM Busy)
 */
router.post(
    '/ai-suggest',
    authenticateToken,
    authorize(['Candidate']),
    cvBuilderValidator.validateAiSuggest,
    CvBuilderController.generateAiSuggestion
);

/**
 * @swagger
 * /api/v1/cv-builder/ats-check:
 *   post:
 *     summary: Đánh giá độ khớp chuẩn ATS của CV so với JD
 *     tags: [CvBuilder]
 *     description: Sử dụng AI để đánh giá mức độ match giữa CV và Job Description (JD).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cvText
 *               - jdText
 *             properties:
 *               cvText:
 *                 type: string
 *                 description: Toàn bộ nội dung CV gom lại
 *                 example: "Kinh nghiệm 2 năm frontend reactjs html css"
 *               jdText:
 *                 type: string
 *                 description: Nội dung mô tả công việc (JD)
 *                 example: "Yêu cầu ứng viên 2 năm kinh nghiệm Nodejs"
 *     responses:
 *       200:
 *         description: Trả về kết quả đánh giá dạng JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Kiểm tra ATS hoàn tất."
 *                 data:
 *                   type: object
 *                   properties:
 *                     matchPercentage:
 *                       type: integer
 *                       example: 45
 *                     missingKeywords:
 *                       type: array
 *                       items:
 *                         type: string
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Lỗi từ AI hoặc gửi thiếu payload
 *       504:
 *         description: Timer Timeout (Server LLM Busy)
 */
router.post(
    '/ats-check',
    authenticateToken,
    authorize(['Candidate']),
    cvBuilderValidator.validateAtsCheck,
    CvBuilderController.checkAtsMatch
);

/**
 * @swagger
 * /api/v1/cv-builder/templates:
 *   get:
 *     summary: Lấy danh sách thư viện template
 *     tags: [CvBuilder]
 *     description: Trả về danh sách metadata của các mẫu CV giúp FE làm thumbnail slider.
 *     parameters:
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *         description: Lọc các template theo ngành nghề (ví dụ IT, Marketing)
 *     responses:
 *       200:
 *         description: Lấy danh sách template thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách template thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Lỗi server nội bộ
 */
router.get(
    '/templates',
    CvBuilderController.getTemplates
);

/**
 * @swagger
 * /api/v1/cv-builder/auto-fill:
 *   get:
 *     summary: Tự động lấy & đồng bộ dữ liệu từ hồ sơ
 *     tags: [CvBuilder]
 *     description: Trích xuất (Clone) các trường cơ bản từ tài khoản User gốc hiện tại sau đó mapping vào cấu trúc JSON của cvData để tự động điền vào CV Builder.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ánh xạ dữ liệu Profile thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ánh xạ dữ liệu Profile thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     personal:
 *                       type: object
 *                     about:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Không tìm thấy dữ liệu người dùng.
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (yêu cầu role Candidate)
 *       500:
 *         description: Lỗi server nội bộ
 */
router.get(
    '/auto-fill',
    authenticateToken,
    authorize(['Candidate']),
    CvBuilderController.autoFillProfile
);

/**
 * @swagger
 * /api/v1/cv-builder:
 *   get:
 *     summary: Lấy bản nháp CV
 *     tags: [CvBuilder]
 *     description: |
 *       Trả về toàn bộ dữ liệu CV đang soạn dở (cvData, themeConfig, atsScore).
 *       Nếu user chưa từng tạo, hệ thống sẽ tự sinh bản nháp mặc định trống và trả về.
 *       Hỗ trợ Data Binding hai chiều cho giao diện Editor kéo-thả của Frontend.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lấy dữ liệu CV Builder thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     templateId:
 *                       type: string
 *                       example: "default_template"
 *                     themeConfig:
 *                       type: object
 *                       example: { "primaryColor": "#000000", "layoutMode": "1-column", "fontFamily": "Inter" }
 *                     cvData:
 *                       type: object
 *                       example: {}
 *                     atsScore:
 *                       type: integer
 *                       example: 0
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (yêu cầu role Candidate)
 *       500:
 *         description: Lỗi server nội bộ
 */
router.get(
    '/',
    authenticateToken,
    authorize(['Candidate']),
    CvBuilderController.getCvDraft
);

/**
 * @swagger
 * /api/v1/cv-builder:
 *   put:
 *     summary: Lưu / Cập nhật bản nháp CV
 *     tags: [CvBuilder]
 *     description: Tiếp nhận dữ liệu JSON để auto-save. Hệ thống sẽ tự động tính điểm ATS ngay lập tức.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateId
 *               - themeConfig
 *               - cvData
 *             properties:
 *               templateId:
 *                 type: string
 *                 example: "modern_02"
 *               themeConfig:
 *                 type: object
 *                 example: { "primaryColor": "#ff0000", "fontFamily": "Inter" }
 *               cvData:
 *                 type: object
 *                 example: { "skills": { "displayStyle": "progressbar", "items": [{ "name": "Node.js", "level": 80 }] } }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật bản nháp thành công."
 *                 newAtsScore:
 *                   type: integer
 *                   example: 75
 *       400:
 *         description: Thiếu thông tin bắt buộc hoặc định dạng JSON không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Phân quyền không hợp lệ
 *       404:
 *         description: Không tìm thấy bản nháp để cập nhật
 */
router.put(
    '/',
    authenticateToken,
    authorize(['Candidate']),
    cvBuilderValidator.validateUpdateDraft,
    CvBuilderController.updateCvDraft
);

module.exports = router;
