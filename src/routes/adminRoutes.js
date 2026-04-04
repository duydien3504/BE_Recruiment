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

const CategoryController = require('../controllers/CategoryController');

/**
 * @swagger
 * /api/v1/admin/categories:
 *   post:
 *     summary: Tạo ngành nghề mới (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trả về category mới tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo ngành nghề thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                      categoryId:
 *                        type: integer
 *                      name:
 *                        type: string
 *       400:
 *         description: Tên không hợp lệ hoặc đã tồn tại
 *       403:
 *         description: Không có quyền truy cập
 */
router.post('/categories', authenticateToken, authorize(['Admin']), CategoryController.createCategory);

/**
 * @swagger
 * /api/v1/admin/categories/{id}:
 *   put:
 *     summary: Cập nhật ngành nghề (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
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
 *                   example: "Cập nhật ngành nghề thành công."
 *                 data:
 *                   type: object
 *       400:
 *         description: Tên không hợp lệ hoặc trùng lặp
 *       404:
 *         description: Không tìm thấy
 *       403:
 *         description: Không có quyền truy cập
 *   delete:
 *     summary: Xóa ngành nghề (Admin)
 *     tags: [Admin]
 *     description: Xóa mềm ngành nghề.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
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
 *                   example: "Xóa ngành nghề thành công."
 *       404:
 *         description: Không tìm thấy
 *       403:
 *         description: Không có quyền truy cập
 */
router.put('/categories/:id', authenticateToken, authorize(['Admin']), CategoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, authorize(['Admin']), CategoryController.deleteCategory);

const LocationController = require('../controllers/LocationController');

/**
 * @swagger
 * /api/v1/admin/locations:
 *   post:
 *     summary: Tạo địa điểm mới (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Tên không hợp lệ hoặc trùng lặp
 *       403:
 *         description: Không có quyền truy cập
 */
router.post('/locations', authenticateToken, authorize(['Admin']), LocationController.createLocation);

/**
 * @swagger
 * /api/v1/admin/locations/{id}:
 *   put:
 *     summary: Cập nhật địa điểm (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa địa điểm (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.put('/locations/:id', authenticateToken, authorize(['Admin']), LocationController.updateLocation);
router.delete('/locations/:id', authenticateToken, authorize(['Admin']), LocationController.deleteLocation);

const SkillController = require('../controllers/SkillController');

/**
 * @swagger
 * /api/v1/admin/skills:
 *   post:
 *     summary: Tạo kỹ năng mới (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Tên không hợp lệ hoặc trùng lặp
 *       403:
 *         description: Không có quyền truy cập
 */
router.post('/skills', authenticateToken, authorize(['Admin']), SkillController.createSkill);

/**
 * @swagger
 * /api/v1/admin/skills/{id}:
 *   put:
 *     summary: Cập nhật kỹ năng (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa kỹ năng (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.put('/skills/:id', authenticateToken, authorize(['Admin']), SkillController.updateSkill);
router.delete('/skills/:id', authenticateToken, authorize(['Admin']), SkillController.deleteSkill);

const UserController = require('../controllers/UserController');

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Danh sách người dùng (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên hoặc email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Candidate, Employer]
 *         description: Lọc theo vai trò
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive, Banned]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/users', authenticateToken, authorize(['Admin']), UserController.getAllUsers);

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   get:
 *     summary: Chi tiết người dùng (Admin)
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
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/users/:id', authenticateToken, authorize(['Admin']), UserController.getUserDetail);

/**
 * @swagger
 * /api/v1/admin/users/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái người dùng (Admin)
 *     tags: [Admin]
 *     description: Ban hoặc Active tài khoản.
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
 *                 enum: [Active, Banned]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       403:
 *         description: Không có quyền truy cập
 */
router.patch('/users/:id/status', authenticateToken, authorize(['Admin']), UserController.updateUserStatus);

const AdminController = require('../controllers/AdminController');
/**
 * @swagger
 * /api/v1/admin/stats/dashboard:
 *   get:
 *     summary: Thống kê tổng quan (Admin)
 *     tags: [Admin]
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
 *                   type: object
 *                   properties:
 *                     total_candidates:
 *                       type: integer
 *                     total_employers:
 *                       type: integer
 *                     total_job_posts:
 *                       type: integer
 *                     total_applications:
 *                       type: integer
 *                     new_users:
 *                       type: integer
 *                     new_jobs:
 *                       type: integer
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/stats/dashboard', authenticateToken, authorize(['Admin']), AdminController.getDashboardStats);

/**
 * @swagger
 * /api/v1/admin/stats/growth:
 *   get:
 *     summary: Thống kê tăng trưởng (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/stats/growth', authenticateToken, authorize(['Admin']), AdminController.getGrowthStats);

/**
 * @swagger
 * /api/v1/admin/companies/{id}/verify:
 *   patch:
 *     summary: Xác thực công ty (Admin)
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
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã cấp tích xanh!"
 *                 verified:
 *                   type: boolean
 *                   example: true
 */
router.patch('/companies/:id/verify', authenticateToken, authorize(['Admin']), AdminController.verifyCompany);

module.exports = router;

