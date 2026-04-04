const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');
const { optionalAuthenticateToken, authenticateToken } = require('../middleware/authMiddleware');
const { validateCreateJob, validateUpdateJob, validateUpdateJobStatus } = require('../validators/jobValidator');

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
 *       - in: query
 *         name: job_type
 *         schema:
 *           type: string
 *           enum: [fulltime, parttime, remote]
 *       - in: query
 *         name: experience_required
 *         schema:
 *           type: string
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
 *               job_type:
 *                 type: string
 *                 enum: [fulltime, parttime, remote]
 *               experience_required:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
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
router.post('/', authenticateToken, validateCreateJob, JobController.createJob);

/**
 * @swagger
 * /api/v1/jobs/suggested:
 *   get:
 *     summary: Gợi ý việc làm AI (Candidate)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobId:
 *                         type: integer
 *                       match_score:
 *                         type: integer
 *                       reason:
 *                         type: string
 *       400:
 *         description: Chưa có CV
 */
router.get('/suggested', authenticateToken, JobController.getSuggestedJobs);

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

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Cập nhật tin tuyển dụng (Employer)
 *     tags: [Jobs]
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
 *               job_type:
 *                 type: string
 *                 enum: [fulltime, parttime, remote]
 *               experience_required:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy việc làm
 */
router.put('/:id', authenticateToken, validateUpdateJob, JobController.updateJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     summary: Xóa tin tuyển dụng (Employer)
 *     tags: [Jobs]
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
 *         description: Đã xóa tin tuyển dụng
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy việc làm
 */
router.delete('/:id', authenticateToken, JobController.deleteJob);

/**
 * @swagger
 * /api/v1/jobs/{id}/status:
 *   patch:
 *     summary: Đổi trạng thái Đóng/Mở tin (Employer)
 *     tags: [Jobs]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, Closed]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ hoặc tin đã hết hạn
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy việc làm
 */
router.patch('/:id/status', authenticateToken, validateUpdateJobStatus, JobController.updateJobStatus);

module.exports = router;
