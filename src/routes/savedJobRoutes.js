const express = require('express');
const router = express.Router();
const SavedJobController = require('../controllers/SavedJobController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: SavedJobs
 *   description: Quản lý việc làm đã lưu
 */

/**
 * @swagger
 * /api/v1/saved-jobs:
 *   post:
 *     summary: Lưu công việc (Save Job)
 *     tags: [SavedJobs]
 *     description: Thêm job vào danh sách yêu thích.
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
 *             properties:
 *               jobPostId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Lưu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã lưu việc làm vào danh sách yêu thích."
 *       400:
 *         description: Thiếu thông tin hoặc Job đã được lưu
 *       404:
 *         description: Job không tồn tại
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/', authenticateToken, SavedJobController.saveJob);

/**
 * @swagger
 * /api/v1/saved-jobs:
 *   get:
 *     summary: Xem danh sách việc đã lưu
 *     tags: [SavedJobs]
 *     description: Xem list job đã lưu.
 *     security:
 *       - bearerAuth: []
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
 *                   example: "Lấy danh sách việc làm đã lưu thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       jobPostId:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       jobPost:
 *                         type: object
 *                         properties:
 *                           jobTitle:
 *                             type: string
 *                           salaryMin:
 *                             type: number
 *                           salaryMax:
 *                             type: number
 *                           company:
 *                             type: object
 *                             properties:
 *                               companyName:
 *                                 type: string
 *                               logo:
 *                                 type: string
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/', authenticateToken, SavedJobController.getSavedJobs);

/**
 * @swagger
 * /api/v1/saved-jobs/{id}:
 *   delete:
 *     summary: Bỏ lưu công việc
 *     tags: [SavedJobs]
 *     description: Xóa job khỏi danh sách yêu thích.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job Post ID
 *     responses:
 *       200:
 *         description: Bỏ lưu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã bỏ lưu việc làm."
 *       404:
 *         description: Việc làm chưa được lưu
 *       401:
 *         description: Chưa đăng nhập
 */
router.delete('/:id', authenticateToken, SavedJobController.unsaveJob);

module.exports = router;
