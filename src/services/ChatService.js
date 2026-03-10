const { ConversationRepository, MessageRepository, CompanyRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const { saveAndSendNotification } = require('./SocketService');

class ChatService {
    /**
     * Start or Get Conversation
     * @param {string} senderId - ID của người gửi (từ token)
     * @param {string} senderRole - Role của người gửi
     * @param {string} receiverUserId - ID của user muốn nhắn tin
     */
    async startConversation(senderId, senderRole, receiverUserId) {
        // Validate receiverUserId
        if (!receiverUserId) {
            const error = new Error('Vui lòng cung cấp receiverUserId.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Không được nhắn tin với chính mình
        if (senderId === receiverUserId) {
            const error = new Error('Không thể tạo cuộc trò chuyện với chính mình.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        let userId, companyId;

        // Kiểm tra xem người nhận có phải là Employer (có company) không
        const receiverCompany = await CompanyRepository.findByUserId(receiverUserId);

        // Kiểm tra xem người gửi có phải là Employer (có company) không
        const senderCompany = await CompanyRepository.findByUserId(senderId);

        // Logic xác định userId và companyId cho conversation
        if (receiverCompany) {
            // Người nhận là Employer -> conversation giữa sender (user side) và receiver's company
            userId = senderId;
            companyId = receiverCompany.companyId;
        } else if (senderCompany) {
            // Người gửi là Employer -> conversation giữa receiver (user side) và sender's company
            userId = receiverUserId;
            companyId = senderCompany.companyId;
        } else {
            // Cả hai đều không có company -> không thể tạo conversation
            const error = new Error('Không thể tạo cuộc trò chuyện. Ít nhất một người phải là Employer.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Check existing conversation
        let conversation = await ConversationRepository.findByParticipants(userId, companyId);
        if (!conversation) {
            conversation = await ConversationRepository.create({
                userId,
                companyId,
                lastMessageAt: new Date()
            });
        }

        return conversation;
    }

    async getConversations(userId, role) {
        const roleUpper = role ? role.toUpperCase() : '';
        console.log(`[ChatService] getConversations for User: ${userId}, Role: ${roleUpper}`);

        if (roleUpper === 'CANDIDATE' || roleUpper === 'ADMIN') {
            // Candidate và Admin chỉ xem cuộc trò chuyện của chính mình (user side)
            const convs = await ConversationRepository.findByUser(userId);
            console.log(`[ChatService] Found ${convs.length} conversations for User/Admin`);
            return convs;
        } else if (roleUpper === 'EMPLOYER' || roleUpper === 'RECRUITER') {
            // Employer/Recruiter xem cuộc trò chuyện của company
            console.log(`[ChatService] Finding company for user ${userId}...`);
            const myCompany = await CompanyRepository.findByUserId(userId);

            if (!myCompany) {
                console.warn(`[ChatService] Company not found for Employer ${userId}`);
                return [];
            }

            console.log(`[ChatService] Found Company: ${myCompany.companyId}. Fetching conversations...`);
            const convs = await ConversationRepository.findByCompany(myCompany.companyId);
            console.log(`[ChatService] Found ${convs.length} conversations for Company ${myCompany.companyId}`);
            return convs;
        } else {
            console.warn(`[ChatService] Unknown role: ${role}`);
            return [];
        }
    }

    async getMessages(userId, role, conversationId) {
        // Validation: User must be part of conversation
        const conversation = await ConversationRepository.findById(conversationId);
        if (!conversation) {
            const error = new Error(MESSAGES.CONVERSATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        let isParticipant = false;
        const roleUpper = role.toUpperCase();

        if (roleUpper === 'CANDIDATE' || roleUpper === 'ADMIN') {
            // Candidate và Admin: kiểm tra xem có phải user side của conversation không
            if (String(conversation.userId) === String(userId)) {
                isParticipant = true;
            }
        } else if (roleUpper === 'EMPLOYER' || roleUpper === 'RECRUITER') {
            // Employer/Recruiter: kiểm tra xem có phải company side của conversation không
            const myCompany = await CompanyRepository.findByUserId(userId);
            if (myCompany && String(myCompany.companyId) === String(conversation.companyId)) {
                isParticipant = true;
            }
        }

        if (!isParticipant) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        return await MessageRepository.findByConversation(conversationId);
    }

    /**
     * Send Message
     * @param {string} senderId
     * @param {string} role
     * @param {object} data - { conversationId, content }
     */
    async sendMessage(senderId, role, data) {
        const { conversationId, content } = data;

        // Validation
        const conversation = await ConversationRepository.findById(conversationId);
        if (!conversation) {
            const error = new Error(MESSAGES.CONVERSATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        let receiverUserId = null;

        // Check permission & Determine Receiver
        const senderRole = role.toUpperCase();

        if (senderRole === 'ADMIN' || senderRole === 'CANDIDATE') {
            // Check if user is the participant (user side)
            if (String(conversation.userId) !== String(senderId)) {
                const error = new Error(MESSAGES.FORBIDDEN);
                error.status = HTTP_STATUS.FORBIDDEN;
                throw error;
            }

            // Receiver is Employer (Company Owner)
            // Note: Admin/Candidate acts as User side, chatting with a Company.
            const company = await CompanyRepository.findById(conversation.companyId);
            if (company) receiverUserId = company.userId;

        } else if (senderRole === 'EMPLOYER') {
            const myCompany = await CompanyRepository.findByUserId(senderId);
            if (!myCompany || String(myCompany.companyId) !== String(conversation.companyId)) {
                const error = new Error(MESSAGES.FORBIDDEN);
                error.status = HTTP_STATUS.FORBIDDEN;
                throw error;
            }

            // Receiver is Candidate (or whoever is on the user side)
            receiverUserId = conversation.userId;
        } else {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Create Message
        const message = await MessageRepository.create({
            conversationsId: conversationId,
            senderId: senderId,
            content: content,
            isRead: false
        });

        // Update Last Message Time
        await ConversationRepository.updateLastMessage(conversationId, new Date());

        // Send Realtime Notification
        if (receiverUserId) {
            const { sendNotificationToUser } = require('./SocketService');

            // Emit 'new_message' event specifically for chat
            // Emit 'new_message' event specifically for chat
            const socketData = message.toJSON ? message.toJSON() : {
                messageId: message.messageId,
                conversationId,
                senderId,
                content,
                createdAt: message.createdAt
            };

            // Use sendNotificationToUser BUT maybe we want a dedicated chat event?
            // Reusing sendNotificationToUser is fine if client listens to it.
            // But usually chat has 'receive_message' event.
            // Let's use getIO() to emit custom event if needed
            try {
                const { getIO } = require('./SocketService');
                const io = getIO();
                io.to(`user_${receiverUserId}`).emit('receive_message', socketData);
                console.log(`Chat sent to user_${receiverUserId}`);

                // Also send a general notification about new message (optional)
                /*
                await saveAndSendNotification(receiverUserId, 'new_notification', {
                    title: 'Tin nhắn mới',
                    message: `Bạn có tin nhắn mới: ${content.substring(0, 30)}...`,
                    type: 'MESSAGE',
                    conversationId: conversationId
                });
                */
            } catch (e) {
                console.error('Socket Chat Error', e);
            }
        }

        return message;
    }
}

module.exports = new ChatService();
