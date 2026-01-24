const BaseRepository = require('./BaseRepository');
const { Conversation } = require('../models');

class ConversationRepository extends BaseRepository {
    constructor() {
        super(Conversation);
    }

    async findByUser(userId, options = {}) {
        return await this.findAll({ userId }, options);
    }

    async findByCompany(companyId, options = {}) {
        return await this.findAll({ companyId }, options);
    }

    async findByUserAndCompany(userId, companyId) {
        return await this.findOne({ userId, companyId });
    }

    async updateLastMessage(conversationsId) {
        return await this.update(conversationsId, { lastMessageAt: new Date() });
    }
}

module.exports = new ConversationRepository();
