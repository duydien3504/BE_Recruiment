const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const { validateRejectJob } = require('../validators/jobValidator');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API dành cho Admin
 */

/**
 * @swagger
 * /api/v1/admin/jobs/pending:
 *   get:
 *     summary: Danh sách tin chờ duyệt (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/jobs/pending', authenticateToken, authorize(['Admin']), JobController.getPendingJobs);

/**
 * @swagger
 * /api/v1/admin/jobs/{id}/approve:
 *   patch:
 *     summary: Duyệt tin tuyển dụng (Admin)
 *     tags: [Admin]
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
 *         description: Đã phê duyệt tin
 *       400:
 *         description: Trạng thái không hợp lệ (không phải Pending)
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tin
 */
router.patch('/jobs/:id/approve', authenticateToken, authorize(['Admin']), JobController.approveJob);

/**
 * @swagger
 * /api/v1/admin/jobs/{id}/reject:
 *   patch:
 *     summary: Từ chối tin tuyển dụng (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã từ chối tin
 *       400:
 *         description: Trạng thái không hợp lệ hoặc thiếu lý do
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tin
 */
router.patch('/jobs/:id/reject', authenticateToken, authorize(['Admin']), validateRejectJob, JobController.rejectJob);

/**
 * @swagger
 * /api/v1/admin/jobs:
 *   get:
 *     summary: Quản lý toàn bộ tin tuyển dụng (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         description: Lọc theo công ty
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Tìm theo tiêu đề
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang số
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mỗi trang
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/jobs', authenticateToken, authorize(['Admin']), JobController.getAllJobs);

module.exports = router;
