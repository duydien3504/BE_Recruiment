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

module.exports = router;
