const MESSAGES = {
    // Auth messages
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác thực.',
    LOGIN_SUCCESS: 'Đăng nhập thành công.',
    EMAIL_ALREADY_EXISTS: 'Email đã tồn tại trong hệ thống.',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác.',
    ACCOUNT_NOT_VERIFIED: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.',
    ACCOUNT_LOCKED: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.',
    USER_NOT_FOUND: 'Người dùng không tồn tại.',
    INVALID_ROLE: 'Role không hợp lệ.',
    OTP_SENT_SUCCESS: 'Mã OTP đã được gửi đến email của bạn.',
    EMAIL_NOT_FOUND: 'Email không tồn tại trong hệ thống.',
    OTP_VERIFY_SUCCESS: 'Xác thực OTP thành công.',
    OTP_INVALID: 'Mã OTP không chính xác.',
    OTP_EXPIRED: 'Mã OTP đã hết hạn.',
    OTP_ALREADY_USED: 'Mã OTP đã được sử dụng.',
    PASSWORD_RESET_SUCCESS: 'Mật khẩu mới đã được gửi vào email của bạn.',
    REFRESH_TOKEN_SUCCESS: 'Thành công.',
    LOGOUT_SUCCESS: 'Đăng xuất thành công.',
    INVALID_TOKEN: 'Token không hợp lệ hoặc đã hết hạn.',
    REFRESH_TOKEN_REQUIRED: 'Refresh token là bắt buộc.',

    // Validation messages
    EMAIL_REQUIRED: 'Email là bắt buộc.',
    EMAIL_INVALID: 'Email không đúng định dạng.',
    PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc.',
    PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 8 ký tự.',
    PASSWORD_PATTERN: 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số.',
    FULL_NAME_REQUIRED: 'Họ tên là bắt buộc.',
    ROLE_ID_REQUIRED: 'Role ID là bắt buộc.',
    OTP_REQUIRED: 'Mã OTP là bắt buộc.',
    OTP_PATTERN: 'Mã OTP phải là 6 chữ số.',

    // Server errors
    INTERNAL_SERVER_ERROR: 'Lỗi server nội bộ.'
};

module.exports = MESSAGES;
