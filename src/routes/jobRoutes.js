const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');
const { optionalAuthenticateToken, authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Quản lý việc làm
 */

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: Tìm kiếm việc làm (Public)
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: location_id
 *         schema:
 *           type: integer
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
 *                 data:
 *                   type: array
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalPages:
 *                       type: integer
 */
router.get('/', JobController.getJobs);

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Tạo tin tuyển dụng (Employer)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category_id
 *               - location_id
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               location_id:
 *                 type: integer
 *               level_id:
 *                 type: integer
 *               salary_min:
 *                 type: number
 *               salary_max:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo tin tuyển dụng thành công. Vui lòng thanh toán để đăng bài."
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobPostId:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       example: "Draft"
 *                     paymentUrl:
 *                       type: string
 *                       example: "https://sandbox.vnpayment.vn/..."
 *                     amount:
 *                       type: number
 *                       example: 10000
 */
router.post('/', authenticateToken, JobController.createJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Xem chi tiết việc làm
 *     tags: [Jobs]
 *     description: Xem chi tiết công việc. Nếu chưa đăng nhập sẽ ẩn mức lương.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
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
 *                 data:
 *                   type: object
 *       404:
 *         description: Không tìm thấy việc làm
 */
router.get('/:id', optionalAuthenticateToken, JobController.getJobDetail);

module.exports = router;
