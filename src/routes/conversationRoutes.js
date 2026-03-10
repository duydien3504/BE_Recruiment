const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

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
 *     description: |
 *       Tạo conversation bằng cách truyền vào **receiverUserId** (ID của người muốn nhắn tin).
 *       
 *       **Logic tự động**:
 *       - Nếu người nhận là Employer: Tạo conversation giữa người gửi và công ty của người nhận
 *       - Nếu người gửi là Employer: Tạo conversation giữa người nhận và công ty của người gửi
 *       - Nếu cả hai đều không phải Employer: Báo lỗi (cần ít nhất 1 Employer)
 *       
 *       **Lưu ý**: Không được nhắn tin với chính mình.
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverUserId
 *             properties:
 *               receiverUserId:
 *                 type: string
 *                 format: uuid
 *                 description: ID của User muốn nhắn tin
 *                 example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
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
 *                   example: "Tạo cuộc trò chuyện thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversationId:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     companyId:
 *                       type: string
 *                       format: uuid
 *                     lastMessageAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Thiếu receiverUserId hoặc nhắn tin với chính mình
 *       404:
 *         description: Không tìm thấy người nhận
 */
router.post('/', authenticateToken, authorize(['Admin', 'Employer', 'Candidate']), ChatController.startConversation);

/**
 * @swagger
 * /api/v1/conversations:
 *   get:
 *     summary: Lấy danh sách cuộc trò chuyện của tài khoản
 *     description: |
 *       Lấy danh sách các cuộc trò chuyện mà tài khoản hiện tại tham gia.
 *       
 *       **Quyền truy cập**:
 *       - **Candidate/Admin**: Lấy các cuộc trò chuyện mà mình là user side
 *       - **Employer/Recruiter**: Lấy các cuộc trò chuyện của công ty mình
 *       
 *       **Lưu ý**: Không thể xem cuộc trò chuyện của người khác
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công - Trả về danh sách cuộc trò chuyện của user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách cuộc trò chuyện thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       conversationId:
 *                         type: string
 *                         format: uuid
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       companyId:
 *                         type: string
 *                         format: uuid
 *                       lastMessageAt:
 *                         type: string
 *                         format: date-time
 */
router.get('/', authenticateToken, authorize(['Admin', 'Employer', 'Candidate']), ChatController.getConversations);

/**
 * @swagger
 * /api/v1/conversations/{id}/messages:
 *   get:
 *     summary: Lấy lịch sử tin nhắn của một cuộc trò chuyện
 *     description: |
 *       Lấy tất cả tin nhắn trong một cuộc trò chuyện cụ thể.
 *       
 *       **Quyền truy cập**:
 *       - Chỉ được xem tin nhắn trong cuộc trò chuyện mà mình tham gia
 *       - **Candidate/Admin**: Phải là user side của conversation
 *       - **Employer/Recruiter**: Phải là company side của conversation
 *       
 *       **Lưu ý**: Không thể xem tin nhắn của cuộc trò chuyện người khác
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
 *           format: uuid
 *     responses:
 *       200:
 *         description: Thành công - Trả về danh sách tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy tin nhắn thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       messageId:
 *                         type: string
 *                         format: uuid
 *                       conversationId:
 *                         type: string
 *                         format: uuid
 *                       senderId:
 *                         type: string
 *                         format: uuid
 *                       content:
 *                         type: string
 *                       isRead:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       403:
 *         description: Không có quyền truy cập - User không phải participant của conversation
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
router.get('/:id/messages', authenticateToken, authorize(['Admin', 'Employer', 'Candidate']), ChatController.getMessages);

module.exports = router;
