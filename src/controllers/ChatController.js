const ChatService = require('../services/ChatService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');

class ChatController {
    /**
     * Start conversation
     * @route POST /api/v1/conversations
     */
    async startConversation(req, res, next) {
        try {
            const senderId = req.user.userId;
            const senderRole = req.user.role;
            const { receiverId } = req.body; // Can be CompanyId or CandidateUserId

            const conversation = await ChatService.startConversation(senderId, senderRole, receiverId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.CREATE_CONVERSATION_SUCCESS,
                data: conversation
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get list conversations
     * @route GET /api/v1/conversations
     */
    async getConversations(req, res, next) {
        try {
            const userId = req.user.userId;
            const role = req.user.role;

            const conversations = await ChatService.getConversations(userId, role);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_CONVERSATIONS_SUCCESS,
                data: conversations
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get messages
     * @route GET /api/v1/conversations/{id}/messages
     */
    async getMessages(req, res, next) {
        try {
            const userId = req.user.userId;
            const role = req.user.role;
            const { id } = req.params;

            const messages = await ChatService.getMessages(userId, role, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_MESSAGES_SUCCESS,
                data: messages
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Send message
     * @route POST /api/v1/messages
     */
    async sendMessage(req, res, next) {
        try {
            const senderId = req.user.userId;
            const role = req.user.role;

            // data check
            const message = await ChatService.sendMessage(senderId, role, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.SEND_MESSAGE_SUCCESS,
                data: message
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ChatController();
