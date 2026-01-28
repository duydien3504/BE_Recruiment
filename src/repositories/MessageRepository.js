const BaseRepository = require('./BaseRepository');
const { Message } = require('../models');

class MessageRepository extends BaseRepository {
    constructor() {
        super(Message);
    }

    async findByConversation(conversationId, options = {}) {
        return await this.findAll(
            { conversationsId: conversationId },
            {
                order: [['created_at', 'ASC']], // Oldest first for chat history
                ...options
            }
        );
    }
}

module.exports = new MessageRepository();
