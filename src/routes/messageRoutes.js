const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Quản lý tin nhắn
 */

/**
 * @swagger
 * /api/v1/messages:
 *   post:
 *     summary: Gửi tin nhắn
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - conversationId
 *               - content
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
router.post('/', authenticateToken, authorize(['Admin', 'Employer', 'Candidate']), ChatController.sendMessage);

module.exports = router;
