const BaseRepository = require('./BaseRepository');
const { Notification } = require('../models');
const { Op } = require('sequelize');

class NotificationRepository extends BaseRepository {
    constructor() {
        super(Notification);
    }

    /**
     * Lấy thông báo của user, có thể lọc theo mảng type.
     * @param {string} userId
     * @param {object} options - Sequelize options (limit, offset, order)
     * @param {string[]|null} types - Lọc theo type; null = lấy tất cả
     */
    async findByUser(userId, options = {}, types = null) {
        const where = { userId };
        if (Array.isArray(types) && types.length > 0) {
            where.type = { [Op.in]: types };
        }
        return await this.findAll(where, options);
    }

    async findUnreadByUser(userId, options = {}) {
        return await this.findAll({ userId, isRead: false }, options);
    }

    /**
     * Đếm thông báo chưa đọc, có thể lọc theo mảng type.
     * @param {string} userId
     * @param {string[]|null} types
     */
    async countUnreadByUser(userId, types = null) {
        const where = { userId, isRead: false };
        if (Array.isArray(types) && types.length > 0) {
            where.type = { [Op.in]: types };
        }
        return await this.count(where);
    }

    async markAsRead(notificationId) {
        return await this.update(notificationId, { isRead: true });
    }

    async markAllAsRead(userId) {
        return await this.model.update(
            { isRead: true },
            { where: { userId, isRead: false } }
        );
    }
}

module.exports = new NotificationRepository();
