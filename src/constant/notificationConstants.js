/**
 * Hằng số kiểu thông báo và phân quyền theo role.
 * Dùng để filter thông báo đúng role khi gọi API GET /api/v1/notifications.
 */

const NOTIFICATION_TYPES = {
    // Employer nhận
    APPLICATION:              'APPLICATION',           // Có ứng viên mới nộp đơn
    CHAT:                     'CHAT',                  // Tin nhắn mới (Employer + Candidate)

    // Candidate nhận
    APPLICATION_STATUS:       'APPLICATION_STATUS',    // Đơn được cập nhật trạng thái
    INTERVIEW:                'INTERVIEW',             // Có lịch phỏng vấn mới

    // Admin nhận
    NEW_JOB_POST:             'NEW_JOB_POST',          // Tin tuyển dụng mới kích hoạt
    NEW_EMPLOYER_REGISTRATION:'NEW_EMPLOYER_REGISTRATION', // Employer mới đăng ký
    UPGRADE_EMPLOYER:         'UPGRADE_EMPLOYER'       // Tài khoản nâng cấp Employer
};

/**
 * Map role → danh sách type được phép xem.
 * Role name khớp với req.user.role từ JWT middleware (case-insensitive khi dùng).
 */
const NOTIFICATION_TYPES_BY_ROLE = {
    Admin: [
        NOTIFICATION_TYPES.NEW_JOB_POST,
        NOTIFICATION_TYPES.NEW_EMPLOYER_REGISTRATION,
        NOTIFICATION_TYPES.UPGRADE_EMPLOYER
    ],
    Employer: [
        NOTIFICATION_TYPES.APPLICATION,
        NOTIFICATION_TYPES.CHAT
    ],
    Candidate: [
        NOTIFICATION_TYPES.APPLICATION_STATUS,
        NOTIFICATION_TYPES.INTERVIEW,
        NOTIFICATION_TYPES.CHAT
    ]
};

module.exports = { NOTIFICATION_TYPES, NOTIFICATION_TYPES_BY_ROLE };
