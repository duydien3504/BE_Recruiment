const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');
const ApplicationController = require('../controllers/ApplicationController');
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

/**
 * @swagger
 * /api/v1/employer/applications/job/{jobId}:
 *   get:
 *     summary: Danh sách ứng viên theo Job (Employer)
 *     tags: [Employer]
 *     description: Xem danh sách người nộp cho 1 job.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job Post ID
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
 *                   example: "Lấy danh sách ứng viên thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       applicationId:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           phoneNumber:
 *                             type: string
 *                           avatarUrl:
 *                             type: string
 *                       resume:
 *                         type: object
 *                         properties:
 *                           fileName:
 *                             type: string
 *                           fileUrl:
 *                             type: string
 *       404:
 *         description: Job không tồn tại
 *       403:
 *         description: Không có quyền xem (không phải chủ job)
 */
router.get('/applications/job/:jobId', authenticateToken, ApplicationController.getJobApplications);

/**
 * @swagger
 * /api/v1/employer/applications/{id}:
 *   get:
 *     summary: Chi tiết hồ sơ ứng viên (Employer)
 *     tags: [Employer]
 *     description: Xem chi tiết hồ sơ và CV của ứng viên.
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         fullName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phoneNumber:
 *                           type: string
 *                         avatarUrl:
 *                           type: string
 *                     resume:
 *                       type: object
 *                       properties:
 *                         fileName:
 *                           type: string
 *                         fileUrl:
 *                           type: string
 *                     jobPost:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *       404:
 *         description: Không tìm thấy
 *       403:
 *         description: Không có quyền xem
 */
router.get('/applications/:id', authenticateToken, ApplicationController.getEmployerApplicationDetail);

/**
 * @swagger
 * /api/v1/employer/applications/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái hồ sơ (Employer)
 *     tags: [Employer]
 *     description: Chuyển trạng thái hồ sơ ứng viên.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
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
 *                 enum: [Interview, Accepted, Rejected, Viewed]
 *                 description: New status
 *               note:
 *                 type: string
 *                 description: Optional note/reason
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
 *                   example: "Cập nhật trạng thái hồ sơ thành công."
 *       400:
 *         description: Trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy
 *       403:
 *         description: Không có quyền
 */
router.patch('/applications/:id/status', authenticateToken, ApplicationController.updateApplicationStatus);

const InterviewController = require('../controllers/InterviewController');

/**
 * @swagger
 * /api/v1/employer/interviews:
 *   get:
 *     summary: Danh sách lịch phỏng vấn (Employer)
 *     tags: [Employer]
 *     description: Xem tất cả lịch pv sắp tới của nhà tuyển dụng.
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
 *                   example: "Lấy danh sách lịch phỏng vấn thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/interviews', authenticateToken, InterviewController.getEmployerInterviews);

module.exports = router;
