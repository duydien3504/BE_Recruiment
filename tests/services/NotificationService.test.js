const NotificationService = require('../../src/services/NotificationService');
const { NotificationRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories');

describe('NotificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getMyNotifications', () => {
        it('should return list of notifications', async () => {
            const userId = 'user1';
            const mockNotifications = [{ id: 1, title: 'Test' }];
            NotificationRepository.findByUser.mockResolvedValue(mockNotifications);

            const result = await NotificationService.getMyNotifications(userId, {});

            expect(NotificationRepository.findByUser).toHaveBeenCalledWith(userId, expect.objectContaining({
                limit: 20
            }));
            expect(result).toEqual(mockNotifications);
        });
    });

    describe('markAsRead', () => {
        it('should mark notification as read', async () => {
            const userId = 'user1';
            const notificationId = 1;
            const mockNotification = { id: 1, userId: 'user1', isRead: false };

            NotificationRepository.findById.mockResolvedValue(mockNotification);
            NotificationRepository.markAsRead.mockResolvedValue(true);

            await NotificationService.markAsRead(userId, notificationId);

            expect(NotificationRepository.markAsRead).toHaveBeenCalledWith(notificationId);
        });

        it('should throw NOT_FOUND if notification not exists', async () => {
            NotificationRepository.findById.mockResolvedValue(null);
            await expect(NotificationService.markAsRead('user1', 99)).rejects.toThrow('Không tìm thấy thông báo.');
        });

        it('should throw FORBIDDEN if user is not owner', async () => {
            const mockNotification = { id: 1, userId: 'user2', isRead: false };
            NotificationRepository.findById.mockResolvedValue(mockNotification);
            await expect(NotificationService.markAsRead('user1', 1)).rejects.toThrow(MESSAGES.FORBIDDEN);
        });
    });

    describe('markAllAsRead', () => {
        it('should mark all notifications as read', async () => {
            const userId = 'user1';
            NotificationRepository.markAllAsRead.mockResolvedValue([5]); // Update returns [affectedCount]

            await NotificationService.markAllAsRead(userId);

            expect(NotificationRepository.markAllAsRead).toHaveBeenCalledWith(userId);
        });
    });

    describe('countUnread', () => {
        it('should return unread count', async () => {
            const userId = 'user1';
            const mockCount = 5;
            NotificationRepository.countUnreadByUser.mockResolvedValue(mockCount);

            const result = await NotificationService.countUnread(userId);

            expect(NotificationRepository.countUnreadByUser).toHaveBeenCalledWith(userId);
            expect(result).toBe(mockCount);
        });
    });
});
