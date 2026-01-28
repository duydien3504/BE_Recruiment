const { NotificationRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class NotificationService {
    /**
     * Get my notifications
     * @param {string} userId
     * @param {object} query - page, limit
     */
    async getMyNotifications(userId, query) {
        const { page = 1, limit = 20 } = query;
        const options = {
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        };

        return await NotificationRepository.findByUser(userId, options);
    }

    /**
     * Mark notification as read
     * @param {string} userId
     * @param {number} notificationId
     */
    async markAsRead(userId, notificationId) {
        const notification = await NotificationRepository.findById(notificationId);
        if (!notification) {
            const error = new Error('Không tìm thấy thông báo.');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (notification.userId !== userId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        return await NotificationRepository.markAsRead(notificationId);
    }

    /**
     * Mark all notifications as read
     * @param {string} userId
     */
    async markAllAsRead(userId) {
        return await NotificationRepository.markAllAsRead(userId);
    }

    /**
     * Count unread notifications
     * @param {string} userId
     */
    async countUnread(userId) {
        return await NotificationRepository.countUnreadByUser(userId);
    }
}

module.exports = new NotificationService();
