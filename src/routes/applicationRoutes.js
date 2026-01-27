const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/ApplicationController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Quản lý ứng tuyển
 */

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     summary: Ứng tuyển (Apply Job)
 *     tags: [Applications]
 *     description: Nộp đơn ứng tuyển vào một công việc.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobPostId
 *               - resumesId
 *             properties:
 *               jobPostId:
 *                 type: integer
 *                 example: 1
 *               resumesId:
 *                 type: integer
 *                 example: 10
 *               cover_letter:
 *                 type: string
 *                 example: "Tôi rất yêu thích công việc này..."
 *     responses:
 *       201:
 *         description: Ứng tuyển thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nộp đơn ứng tuyển thành công."
 *       400:
 *         description: Thiếu thông tin hoặc đã ứng tuyển
 *       404:
 *         description: Job hoặc Resume không tồn tại
 *       403:
 *         description: Resume không thuộc về user
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/', authenticateToken, ApplicationController.applyJob);

module.exports = router;
