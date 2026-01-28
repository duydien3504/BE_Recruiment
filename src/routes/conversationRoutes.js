const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Quản lý hội thoại chat
 */

/**
 * @swagger
 * /api/v1/conversations:
 *   post:
 *     summary: Bắt đầu cuộc trò chuyện mới hoặc lấy cuộc trò chuyện cũ
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID của người nhận (CompanyID nếu là Ứng viên gửi, UserID nếu là Nhà tuyển dụng gửi)
 *             required:
 *               - receiverId
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy người nhận
 */
router.post('/', authenticateToken, ChatController.startConversation);

/**
 * @swagger
 * /api/v1/conversations:
 *   get:
 *     summary: Lấy danh sách cuộc trò chuyện
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', authenticateToken, ChatController.getConversations);

/**
 * @swagger
 * /api/v1/conversations/{id}/messages:
 *   get:
 *     summary: Lấy lịch sử tin nhắn của một cuộc trò chuyện
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/:id/messages', authenticateToken, ChatController.getMessages);

module.exports = router;
