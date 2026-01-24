const BaseRepository = require('./BaseRepository');
const { Message } = require('../models');

class MessageRepository extends BaseRepository {
    constructor() {
        super(Message);
    }

    async findByConversation(conversationsId, options = {}) {
        return await this.findAll(
            { conversationsId, isDeleted: false },
            { ...options, order: [['createdAt', 'ASC']] }
        );
    }

    async findUnreadByConversation(conversationsId) {
        return await this.findAll({ conversationsId, isRead: false, isDeleted: false });
    }

    async markAsRead(messageId) {
        return await this.update(messageId, { isRead: true });
    }

    async markConversationMessagesAsRead(conversationsId, senderId) {
        return await this.model.update(
            { isRead: true },
            { where: { conversationsId, senderId, isRead: false } }
        );
    }
}

module.exports = new MessageRepository();
