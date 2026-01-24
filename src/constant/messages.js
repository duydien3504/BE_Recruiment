const MESSAGES = {
    // Auth messages
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác thực.',
    EMAIL_ALREADY_EXISTS: 'Email đã tồn tại trong hệ thống.',
    INVALID_ROLE: 'Role không hợp lệ.',

    // Validation messages
    EMAIL_REQUIRED: 'Email là bắt buộc.',
    EMAIL_INVALID: 'Email không đúng định dạng.',
    PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc.',
    PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 8 ký tự.',
    PASSWORD_PATTERN: 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số.',
    FULL_NAME_REQUIRED: 'Họ tên là bắt buộc.',
    ROLE_ID_REQUIRED: 'Role ID là bắt buộc.',

    // Server errors
    INTERNAL_SERVER_ERROR: 'Lỗi server nội bộ.'
};

module.exports = MESSAGES;
