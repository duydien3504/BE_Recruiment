const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/ApplicationController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const { validateCancelApplicationParam, validateMyApplicationsQuery } = require('../validators/applicationValidator');
const { ROLE_NAMES } = require('../constant/roles');

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
 * /api/v1/candidate/applications/my-applications:
 *   get:
 *     summary: Danh sách hồ sơ ứng tuyển có phân trang (Candidate)
 *     tags: [Candidate Applications]
 *     description: |
 *       Lấy danh sách lịch sử hồ sơ ứng tuyển của Candidate, hỗ trợ lọc theo trạng thái và phân trang.
 *       Route này phải được khai báo **trước** `/applications/{id}` để tránh conflict với path param.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Pending, Viewed, Interview, Accepted, Rejected]
 *         description: Lọc hồ sơ theo trạng thái (bỏ trống = lấy tất cả)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Số record mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách hồ sơ thành công
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
 *                   example: "Lấy danh sách hồ sơ ứng tuyển thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     applications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           applicationId:
 *                             type: integer
 *                             example: 12
 *                           jobPostId:
 *                             type: integer
 *                             example: 5
 *                           jobTitle:
 *                             type: string
 *                             example: "Backend Node.js Developer"
 *                           companyName:
 *                             type: string
 *                             example: "Tech Corp"
 *                           coverLetter:
 *                             type: string
 *                             example: "Em mong muốn ứng tuyển vị trí..."
 *                           status:
 *                             type: string
 *                             enum: [Pending, Viewed, Interview, Accepted, Rejected]
 *                             example: "Pending"
 *                           appliedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-03-15T11:00:00.000Z"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         totalItems:
 *                           type: integer
 *                           example: 45
 *                         limit:
 *                           type: integer
 *                           example: 10
 *       400:
 *         description: Query params không hợp lệ (page/limit/status sai định dạng)
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       403:
 *         description: Không phải Candidate (sai role)
 */
router.get(
    '/applications/my-applications',
    authenticateToken,
    authorize([ROLE_NAMES[3]]),
    validateMyApplicationsQuery,
    ApplicationController.getMyApplications
);

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

const InterviewController = require('../controllers/InterviewController');

/**
 * @swagger
 * /api/v1/candidate/interviews:
 *   get:
 *     summary: Danh sách lịch phỏng vấn (Candidate)
 *     tags: [Candidate Applications]
 *     description: Candidate xem danh sách các lịch mời phỏng vấn sắp tới.
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
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/interviews', authenticateToken, InterviewController.getCandidateInterviews);

/**
 * @swagger
 * /api/v1/candidate/applications/{applicationId}:
 *   delete:
 *     summary: Huỷ ứng tuyển (Candidate)
 *     tags: [Candidate Applications]
 *     description: |
 *       Ứng viên huỷ (xóa) đơn ứng tuyển của mình.
 *       Chỉ được huỷ khi hồ sơ còn ở trạng thái **Pending** (nhà tuyển dụng chưa xem).
 *       Nếu hồ sơ đã được nhà tuyển dụng tác động (Viewed, Interview, Accepted, Rejected), thao tác sẽ bị từ chối.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID của đơn ứng tuyển cần huỷ
 *         example: 10
 *     responses:
 *       200:
 *         description: Huỷ ứng tuyển thành công
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
 *                   example: "Huỷ ứng tuyển thành công."
 *       400:
 *         description: |
 *           Có 2 trường hợp lỗi:
 *           - applicationId không phải số nguyên dương hợp lệ
 *           - Hồ sơ đã được nhà tuyển dụng xem/xử lý, không thể huỷ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 400
 *                     message:
 *                       type: string
 *                       example: "Không thể huỷ hồ sơ vì nhà tuyển dụng đã tác động vào hồ sơ của bạn."
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       403:
 *         description: Không phải Candidate (sai role)
 *       404:
 *         description: Không tìm thấy đơn ứng tuyển hoặc không thuộc quyền sở hữu
 */
router.delete(
    '/applications/:applicationId',
    authenticateToken,
    authorize([ROLE_NAMES[3]]),
    validateCancelApplicationParam,
    ApplicationController.cancelApplication
);

module.exports = router;
