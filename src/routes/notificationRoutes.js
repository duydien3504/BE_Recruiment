const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Quản lý thông báo
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Lấy danh sách thông báo của user đăng nhập
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng item mỗi trang (default 20)
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, NotificationController.getMyNotifications);

/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     summary: Đánh dấu đã đọc 1 thông báo
 *     tags: [Notifications]
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
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy thông báo
 *       403:
 *         description: Không có quyền truy cập
 */
router.patch('/:id/read', authenticateToken, NotificationController.markAsRead);

/**
 * @swagger
 * /api/v1/notifications/read-all:
 *   patch:
 *     summary: Đánh dấu tất cả thông báo là đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.patch('/read-all', authenticateToken, NotificationController.markAllAsRead);

/**
 * @swagger
 * /api/v1/notifications/unread-count:
 *   get:
 *     summary: Đếm số lượng thông báo chưa đọc
 *     tags: [Notifications]
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
 *                     count:
 *                       type: integer
 */
router.get('/unread-count', authenticateToken, NotificationController.countUnread);

module.exports = router;
