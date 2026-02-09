const express = require('express');
const router = express.Router();
const LevelController = require('../controllers/LevelController');
const { validateCreateLevel, validateUpdateLevel, validateLevelId } = require('../validators/levelValidator');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Levels
 *   description: Level management endpoints
 */

/**
 * @swagger
 * /api/v1/levels:
 *   get:
 *     summary: Lấy danh sách tất cả cấp độ
 *     tags: [Levels]
 *     responses:
 *       200:
 *         description: Lấy danh sách cấp độ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách cấp độ thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       levelId:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Intern"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T00:00:00.000Z"
 */
router.get('/', LevelController.getAllLevels);

/**
 * @swagger
 * /api/v1/levels/{levelId}:
 *   get:
 *     summary: Lấy thông tin cấp độ theo ID
 *     tags: [Levels]
 *     parameters:
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cấp độ
 *     responses:
 *       200:
 *         description: Lấy thông tin cấp độ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin cấp độ thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     levelId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Intern"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: Không tìm thấy cấp độ
 */
router.get('/:levelId', validateLevelId, LevelController.getLevelById);

/**
 * @swagger
 * /api/v1/levels:
 *   post:
 *     summary: Tạo cấp độ mới (Admin only)
 *     tags: [Levels]
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
 *                 example: "Senior"
 *                 description: "Tên cấp độ"
 *     responses:
 *       201:
 *         description: Tạo cấp độ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo cấp độ thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     levelId:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: "Senior"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc tên cấp độ đã tồn tại
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập (chỉ Admin)
 */
router.post(
    '/',
    authenticateToken,
    authorize(['Admin']),
    validateCreateLevel,
    LevelController.createLevel
);

/**
 * @swagger
 * /api/v1/levels/{levelId}:
 *   put:
 *     summary: Cập nhật cấp độ (Admin only)
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cấp độ
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
 *                 example: "Senior Developer"
 *                 description: "Tên cấp độ mới"
 *     responses:
 *       200:
 *         description: Cập nhật cấp độ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật cấp độ thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     levelId:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: "Senior Developer"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc tên cấp độ đã tồn tại
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập (chỉ Admin)
 *       404:
 *         description: Không tìm thấy cấp độ
 */
router.put(
    '/:levelId',
    authenticateToken,
    authorize(['Admin']),
    validateLevelId,
    validateUpdateLevel,
    LevelController.updateLevel
);

/**
 * @swagger
 * /api/v1/levels/{levelId}:
 *   delete:
 *     summary: Xóa cấp độ (Admin only)
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cấp độ
 *     responses:
 *       200:
 *         description: Xóa cấp độ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã xóa cấp độ."
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập (chỉ Admin)
 *       404:
 *         description: Không tìm thấy cấp độ
 */
router.delete(
    '/:levelId',
    authenticateToken,
    authorize(['Admin']),
    validateLevelId,
    LevelController.deleteLevel
);

module.exports = router;
