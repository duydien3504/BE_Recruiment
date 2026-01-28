const { ConversationRepository, MessageRepository, CompanyRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const { saveAndSendNotification } = require('./SocketService');

class ChatService {
    /**
     * Start or Get Conversation
     * @param {string} senderId
     * @param {string} senderRole
     * @param {string} receiverId - Target UUID (CompanyId if Candidate, UserId if Employer)
     */
    async startConversation(senderId, senderRole, receiverId) {
        let userId, companyId;
        const role = senderRole.toUpperCase();

        if (role === 'CANDIDATE') {
            userId = senderId;
            companyId = receiverId;
            // Validate Company exists
            const company = await CompanyRepository.findById(companyId);
            if (!company) {
                const error = new Error('Không tìm thấy công ty.');
                error.status = HTTP_STATUS.NOT_FOUND;
                throw error;
            }
        } else if (role === 'EMPLOYER' || role === 'COMPANY') { // Adjust role name as per system
            // Find my company
            const myCompany = await CompanyRepository.findByUserId(senderId);
            if (!myCompany) {
                const error = new Error('Bạn không có công ty nào.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }
            companyId = myCompany.companyId;
            userId = receiverId; // Target Candidate

            // Validate Candidate exists (Simple check via UserRepo or let FK Constraint handle)
            // Ideally check require('../repositories/UserRepository').findById(userId);
        } else {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Check existing
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
        if (role.toUpperCase() === 'CANDIDATE') {
            return await ConversationRepository.findByUser(userId);
        } else {
            const myCompany = await CompanyRepository.findByUserId(userId);
            if (!myCompany) return [];
            return await ConversationRepository.findByCompany(myCompany.companyId);
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
        if (role.toUpperCase() === 'CANDIDATE') {
            if (conversation.userId === userId) isParticipant = true;
        } else {
            const myCompany = await CompanyRepository.findByUserId(userId);
            if (myCompany && myCompany.companyId === conversation.companyId) isParticipant = true;
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
        if (role.toUpperCase() === 'CANDIDATE') {
            const check = String(conversation.userId) !== String(senderId);
            // console.log(`DEBUG: conversationId=${conversationId} senderId=${senderId} conv.userId=${conversation.userId} check=${check}`);
            if (check) throw new Error(`${MESSAGES.FORBIDDEN} ConvUser:${conversation.userId} Sender:${senderId}`);

            // Receiver is Employer (Company Owner)
            const company = await CompanyRepository.findById(conversation.companyId);
            if (company) receiverUserId = company.userId;

        } else {
            const myCompany = await CompanyRepository.findByUserId(senderId);
            if (!myCompany || myCompany.companyId !== conversation.companyId) throw new Error(MESSAGES.FORBIDDEN);

            // Receiver is Candidate
            receiverUserId = conversation.userId;
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
            const socketData = {
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
