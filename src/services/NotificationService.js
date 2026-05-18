const { NotificationRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const { NOTIFICATION_TYPES_BY_ROLE } = require('../constant/notificationConstants');

class NotificationService {
    /**
     * Lấy danh sách types được phép theo role.
     * Trả về null nếu role không xác định (lấy tất cả — fallback an toàn).
     * @param {string} role - req.user.role ('Admin' | 'Employer' | 'Candidate')
     * @returns {string[]|null}
     */
    _getTypesForRole(role) {
        if (!role) return null;
        // So sánh case-insensitive
        const matched = Object.keys(NOTIFICATION_TYPES_BY_ROLE).find(
            r => r.toLowerCase() === role.toLowerCase()
        );
        return matched ? NOTIFICATION_TYPES_BY_ROLE[matched] : null;
    }

    /**
     * Lấy thông báo của user — chỉ trả đúng loại theo role.
     * @param {string} userId
     * @param {object} query - page, limit
     * @param {string} role  - req.user.role
     */
    async getMyNotifications(userId, query, role) {
        const { page = 1, limit = 20 } = query;
        const options = {
            offset: (parseInt(page) - 1) * parseInt(limit),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        };

        const types = this._getTypesForRole(role);
        return await NotificationRepository.findByUser(userId, options, types);
    }

    /**
     * Mark notification as read — kiểm tra ownership trước.
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
     * Đánh dấu tất cả thông báo là đã đọc.
     * @param {string} userId
     */
    async markAllAsRead(userId) {
        return await NotificationRepository.markAllAsRead(userId);
    }

    /**
     * Đếm thông báo chưa đọc — chỉ tính đúng loại theo role.
     * @param {string} userId
     * @param {string} role - req.user.role
     */
    async countUnread(userId, role) {
        const types = this._getTypesForRole(role);
        return await NotificationRepository.countUnreadByUser(userId, types);
    }
}

module.exports = new NotificationService();
