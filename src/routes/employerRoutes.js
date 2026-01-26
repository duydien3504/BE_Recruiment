const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Employer
 *   description: API dành cho Nhà tuyển dụng
 */

/**
 * @swagger
 * /api/v1/employer/jobs:
 *   get:
 *     summary: Danh sách tin của tôi (Employer)
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Closed, Pending, Rejected, Draft]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/jobs', authenticateToken, JobController.getMyJobs);

/**
 * @swagger
 * /api/v1/employer/jobs/{id}:
 *   get:
 *     summary: Chi tiết tin của tôi (Employer)
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy việc làm
 */
router.get('/jobs/:id', authenticateToken, JobController.getMyJobDetail);

module.exports = router;
