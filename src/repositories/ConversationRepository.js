const BaseRepository = require('./BaseRepository');
const { Conversation, Company, User, Message } = require('../models');

class ConversationRepository extends BaseRepository {
    constructor() {
        super(Conversation);
    }

    // Find conversation by User and Company
    async findByParticipants(userId, companyId) {
        return await this.model.findOne({
            where: {
                userId,
                companyId
            }
        });
    }

    // Get list of conversations for a user (as Candidate)
    // Includes Company info and Last Message
    async findByUser(userId, options = {}) {
        return await this.model.findAll({
            where: { userId },
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['companyId', 'name', 'logoUrl']
                },
                // We might want to include last message here or just use lastMessageAt
            ],
            order: [['lastMessageAt', 'DESC']],
            ...options
        });
    }

    // Get list of conversations for a company (as Employer)
    // Includes User info
    async findByCompany(companyId, options = {}) {
        return await this.model.findAll({
            where: { companyId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['userId', 'fullName', 'avatarUrl']
                }
            ],
            order: [['lastMessageAt', 'DESC']],
            ...options
        });
    }

    // Get all conversations (for Admin)
    async findAll(options = {}) {
        return await this.model.findAll({
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['companyId', 'name', 'logoUrl']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['userId', 'fullName', 'avatarUrl']
                }
            ],
            order: [['lastMessageAt', 'DESC']],
            ...options
        });
    }

    // Find Detail with associations
    async findDetailById(conversationId) {
        return await this.model.findByPk(conversationId, {
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['companyId', 'name', 'logoUrl', 'userId'] // userId of company owner
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['userId', 'fullName', 'avatarUrl']
                }
            ]
        });
    }

    async updateLastMessage(conversationId, time) {
        return await this.update(conversationId, { lastMessageAt: time });
    }
}

module.exports = new ConversationRepository();
