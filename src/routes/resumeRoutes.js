const express = require('express');
const router = express.Router();
const ResumeController = require('../controllers/ResumeController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadPdf, handleUploadError } = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Quản lý hồ sơ (CV)
 */

/**
 * @swagger
 * /api/v1/resumes:
 *   post:
 *     summary: Tải lên CV
 *     tags: [Resumes]
 *     description: Tải lên CV (file PDF, tối đa 5MB). Mỗi user tối đa 5 CV, tối đa 2 CV/ngày.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File CV (PDF only)
 *     responses:
 *       201:
 *         description: Tải lên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tải lên CV thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     resumesId:
 *                       type: integer
 *                     fileUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 *       400:
 *         description: Lỗi validation (File type, size, quota exceeded)
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/', authenticateToken, uploadPdf.single('file'), handleUploadError, ResumeController.uploadResume);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   delete:
 *     summary: Xóa CV
 *     tags: [Resumes]
 *     description: Xóa CV đã upload (Soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Đã xóa CV
 *       403:
 *         description: Không có quyền (không phải chủ sở hữu)
 *       404:
 *         description: Không tìm thấy CV
 */
router.delete('/:id', authenticateToken, ResumeController.deleteResume);

/**
 * @swagger
 * /api/v1/resumes:
 *   get:
 *     summary: Danh sách CV của tôi
 *     tags: [Resumes]
 *     description: Lấy danh sách danh sách CV đã upload của user đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       resumesId:
 *                         type: integer
 *                       fileUrl:
 *                         type: string
 *                       fileName:
 *                         type: string
 *                       isMain:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/', authenticateToken, ResumeController.getMyResumes);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   get:
 *     summary: Xem chi tiết CV
 *     tags: [Resumes]
 *     description: Lấy thông tin chi tiết của 1 CV (bao gồm link view/download)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     resumesId:
 *                       type: integer
 *                     fileUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 *       403:
 *         description: Không có quyền (không phải chủ sở hữu)
 *       404:
 *         description: Không tìm thấy CV
 */
router.get('/:id', authenticateToken, ResumeController.getResumeDetail);

/**
 * @swagger
 * /api/v1/resumes/{id}:
 *   put:
 *     summary: Cập nhật CV
 *     tags: [Resumes]
 *     description: Thay thế file CV cũ bằng file mới (File PDF)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File CV mới (PDF only)
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     resumesId:
 *                       type: integer
 *                     fileUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 *       400:
 *         description: File lỗi hoặc thiếu file
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: CV không tồn tại
 */
router.put('/:id', authenticateToken, uploadPdf.single('file'), handleUploadError, ResumeController.updateResume);

/**
 * @swagger
 * /api/v1/resumes/{id}/set-main:
 *   patch:
 *     summary: Đặt CV chính (Set Main Resume)
 *     tags: [Resumes]
 *     description: Chọn 1 CV làm CV chính để ứng tuyển nhanh.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Đặt CV chính thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đặt CV chính thành công."
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: CV không tồn tại
 */
router.patch('/:id/set-main', authenticateToken, ResumeController.setMainResume);

module.exports = router;
