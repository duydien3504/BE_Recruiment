const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');
const ApplicationController = require('../controllers/ApplicationController');
const CompanyController = require('../controllers/CompanyController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const {
    validateEmployerApplicationsQuery,
    validateEmployerDownloadCvParam
} = require('../validators/applicationValidator');
const { validateGenerateQuestions } = require('../validators/interviewQuestionValidator');
const InterviewQuestionController = require('../controllers/InterviewQuestionController');

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
 * /api/v1/employers/statistics:
 *   get:
 *     summary: Thống kê dashboard cho nhà tuyển dụng
 *     tags: [Employer]
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Thống kê dữ liệu thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalJobPosts:
 *                       type: integer
 *                     totalApplications:
 *                       type: integer
 *                     totalAccepted:
 *                       type: integer
 *                     totalRejected:
 *                       type: integer
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/statistics', authenticateToken, authorize('Employer'), CompanyController.getEmployerStatistics);

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
 *                       appliedAt:
 *                         type: string
 *                         format: date-time
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
 * /api/v1/employers/applications:
 *   get:
 *     summary: Lấy danh sách và lọc ứng viên theo skill, kinh nghiệm
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jobPostId
 *         schema:
 *           type: integer
 *         description: Lọc theo 1 job cụ thể của công ty
 *       - in: query
 *         name: skillIds
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *         description: Danh sách skillId cần lọc, phân tách bởi dấu phẩy
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Số năm kinh nghiệm tối thiểu
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       200:
 *         description: Lấy danh sách ứng viên thành công
 *       400:
 *         description: Query params không hợp lệ
 *       403:
 *         description: Không có quyền truy cập job của công ty khác
 */
router.get(
    '/applications',
    authenticateToken,
    authorize('EMPLOYER'),
    validateEmployerApplicationsQuery,
    ApplicationController.getEmployerApplications
);

/**
 * @swagger
 * /api/v1/employers/applications/{applicationId}/download-cv:
 *   get:
 *     summary: Download CV ứng viên dạng file PDF
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tải file CV thành công
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Không có quyền truy cập hồ sơ của công ty khác
 *       404:
 *         description: Không tìm thấy application hoặc CV
 */
router.get(
    '/applications/:applicationId/download-cv',
    authenticateToken,
    authorize('EMPLOYER'),
    validateEmployerDownloadCvParam,
    ApplicationController.downloadEmployerApplicationCv
);

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

/**
 * @swagger
 * /api/v1/employer/applications/{applicationId}/generate-interview-questions:
 *   post:
 *     summary: Tạo gợi ý câu hỏi phỏng vấn cá nhân hóa qua AI
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               force_regenerate:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Generate interview questions successfully.
 *       400:
 *         description: Candidate CV is missing or invalid.
 *       403:
 *         description: You do not have permission.
 *       404:
 *         description: Application not found.
 */
router.post(
    '/applications/:applicationId/generate-interview-questions',
    authenticateToken,
    authorize('EMPLOYER'),
    validateGenerateQuestions,
    InterviewQuestionController.generateQuestions
);

module.exports = router;
