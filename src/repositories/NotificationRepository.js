const BaseRepository = require('./BaseRepository');
const { Notification } = require('../models');

class NotificationRepository extends BaseRepository {
    constructor() {
        super(Notification);
    }

    async findByUser(userId, options = {}) {
        return await this.findAll({ userId }, options);
    }

    async findUnreadByUser(userId, options = {}) {
        return await this.findAll({ userId, isRead: false }, options);
    }

    async countUnreadByUser(userId) {
        return await this.count({ userId, isRead: false });
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
