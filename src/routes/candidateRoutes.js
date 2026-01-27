const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/ApplicationController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Candidate Applications
 *   description: Quản lý ứng tuyển của ứng viên
 */

/**
 * @swagger
 * /api/v1/candidate/applications:
 *   get:
 *     summary: Lịch sử ứng tuyển (Candidate)
 *     tags: [Candidate Applications]
 *     description: Xem danh sách các job đã nộp và trạng thái hiện tại.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy lịch sử thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy lịch sử ứng tuyển thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       applicationId:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: ['Pending', 'Viewed', 'Interview', 'Accepted', 'Rejected']
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       jobPost:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           salaryMin:
 *                             type: number
 *                           salaryMax:
 *                             type: number
 *                           company:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               logoUrl:
 *                                 type: string
 *                           location:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/applications', authenticateToken, ApplicationController.getCandidateHistory);

/**
 * @swagger
 * /api/v1/candidate/applications/{id}:
 *   get:
 *     summary: Chi tiết đơn ứng tuyển (Candidate)
 *     tags: [Candidate Applications]
 *     description: Xem chi tiết nội dung đã nộp.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy chi tiết đơn ứng tuyển thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     applicationId:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     coverLetter:
 *                       type: string
 *                     jobPost:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         requirements:
 *                           type: string
 *                         company:
 *                           type: object
 *                         location:
 *                           type: object
 *                     resume:
 *                       type: object
 *                       properties:
 *                         fileName:
 *                           type: string
 *                         fileUrl:
 *                           type: string
 *       404:
 *         description: Không tìm thấy đơn ứng tuyển
 *       403:
 *         description: Không có quyền xem (không phải chủ sở hữu)
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/applications/:id', authenticateToken, ApplicationController.getApplicationDetail);

module.exports = router;
