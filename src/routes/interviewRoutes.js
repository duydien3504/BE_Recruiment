const express = require('express');
const router = express.Router();
const InterviewController = require('../controllers/InterviewController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Interviews
 *   description: Quản lý phỏng vấn
 */

/**
 * @swagger
 * /api/v1/interviews:
 *   post:
 *     summary: Tạo lịch phỏng vấn (Employer)
 *     tags: [Interviews]
 *     description: Tạo lịch phỏng vấn và cập nhật trạng thái hồ sơ.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - interview_time
 *               - type
 *             properties:
 *               applicationId:
 *                 type: integer
 *               interview_time:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [Online, Offline]
 *               location:
 *                 type: string
 *               meeting_link:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đã gửi lịch phỏng vấn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã gửi lịch phỏng vấn."
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy hồ sơ
 *       403:
 *         description: Không có quyền truy cập
 */
router.post('/', authenticateToken, InterviewController.createInterview);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   put:
 *     summary: Cập nhật lịch phỏng vấn (Employer)
 *     tags: [Interviews]
 *     description: Dời lịch hoặc đổi địa điểm, link meeting.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Interview ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interview_time:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [Online, Offline]
 *               location:
 *                 type: string
 *               meeting_link:
 *                 type: string
 *               note:
 *                 type: string
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
 *                   example: "Cập nhật lịch phỏng vấn thành công."
 *                 data:
 *                   type: object
 *       404:
 *         description: Không tìm thấy lịch phỏng vấn
 *       403:
 *         description: Không có quyền truy cập
 */
router.put('/:id', authenticateToken, InterviewController.updateInterview);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   delete:
 *     summary: Hủy lịch phỏng vấn (Employer)
 *     tags: [Interviews]
 *     description: Xóa lịch phỏng vấn (Soft delete & set Cancelled).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa lịch phỏng vấn thành công."
 *       404:
 *         description: Không tìm thấy lịch phỏng vấn
 *       403:
 *         description: Không có quyền truy cập
 */
router.delete('/:id', authenticateToken, InterviewController.cancelInterview);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   get:
 *     summary: Chi tiết lịch phỏng vấn
 *     tags: [Interviews]
 *     description: Xem chi tiết lịch phỏng vấn (Employer & Candidate).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy chi tiết lịch phỏng vấn thành công."
 *                 data:
 *                   type: object
 *       404:
 *         description: Không tìm thấy
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/:id', authenticateToken, InterviewController.getInterviewDetail);

module.exports = router;
