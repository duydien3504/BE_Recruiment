const NotificationService = require('../services/NotificationService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');

class NotificationController {
    /**
     * Get my notifications
     * @route GET /api/v1/notifications
     */
    async getMyNotifications(req, res, next) {
        try {
            const userId = req.user.userId;
            const notifications = await NotificationService.getMyNotifications(userId, req.query);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_NOTIFICATIONS_SUCCESS,
                data: notifications
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark notification as read
     * @route PATCH /api/v1/notifications/:id/read
     */
    async markAsRead(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            await NotificationService.markAsRead(userId, id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.MARK_NOTIFICATION_READ_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark all notifications as read
     * @route PATCH /api/v1/notifications/read-all
     */
    async markAllAsRead(req, res, next) {
        try {
            const userId = req.user.userId;
            await NotificationService.markAllAsRead(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.MARK_ALL_READ_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get unread notifications count
     * @route GET /api/v1/notifications/unread-count
     */
    async countUnread(req, res, next) {
        try {
            const userId = req.user.userId;
            const count = await NotificationService.countUnread(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_UNREAD_COUNT_SUCCESS,
                data: { count }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NotificationController();
