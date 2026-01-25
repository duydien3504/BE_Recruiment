const { validateRegister, validateLogin, validateForgotPassword, validateVerifyOtp, validateRefreshToken } = require('../../src/validators/authValidator');
const MESSAGES = require('../../src/constant/messages');

describe('AuthValidator', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('validateRegister', () => {
        test('should pass validation with valid data', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 3
            };

            validateRegister(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should fail when email is missing', () => {
            req.body = {
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 3
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_REQUIRED
                }
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should fail when email is invalid format', () => {
            req.body = {
                email: 'invalid-email',
                password: 'Password123',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_INVALID
                }
            });
        });

        test('should fail when password is missing', () => {
            req.body = {
                email: 'test@example.com',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_REQUIRED
                }
            });
        });

        test('should fail when password is less than 8 characters', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Pass1',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_MIN_LENGTH
                }
            });
        });

        test('should fail when password has no uppercase letter', () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_PATTERN
                }
            });
        });

        test('should fail when password has no number', () => {
            req.body = {
                email: 'test@example.com',
                password: 'PasswordABC',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_PATTERN
                }
            });
        });

        test('should fail when full_name is missing', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.FULL_NAME_REQUIRED
                }
            });
        });

        test('should fail when role_id is invalid (not 2 or 3)', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 1 // Admin - not allowed
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.INVALID_ROLE
                }
            });
        });

        test('should trim full_name whitespace', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: '  Nguyen Van A  '
            };

            validateRegister(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.body.full_name).toBe('Nguyen Van A');
        });
    });

    describe('validateLogin', () => {
        test('should pass validation with valid login data', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123'
            };

            validateLogin(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should fail when email is missing', () => {
            req.body = {
                password: 'Password123'
            };

            validateLogin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_REQUIRED
                }
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should fail when password is missing', () => {
            req.body = {
                email: 'test@example.com'
            };

            validateLogin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_REQUIRED
                }
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should fail when email is invalid format', () => {
            req.body = {
                email: 'not-an-email',
                password: 'Password123'
            };

            validateLogin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_INVALID
                }
            });
        });

        test('should fail when email is empty string', () => {
            req.body = {
                email: '',
                password: 'Password123'
            };

            validateLogin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_REQUIRED
                }
            });
        });

        test('should fail when password is empty string', () => {
            req.body = {
                email: 'test@example.com',
                password: ''
            };

            validateLogin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_REQUIRED
                }
            });
        });

        test('should fail when both email and password are missing', () => {
            req.body = {};

            validateLogin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        test('should accept any password format for login', () => {
            req.body = {
                email: 'test@example.com',
                password: 'anypassword'
            };

            validateLogin(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('validateForgotPassword', () => {
        test('should pass validation with valid email', () => {
            req.body = {
                email: 'test@example.com'
            };

            validateForgotPassword(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should fail when email is missing', () => {
            req.body = {};

            validateForgotPassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_REQUIRED
                }
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should fail when email is invalid format', () => {
            req.body = {
                email: 'invalid-email'
            };

            validateForgotPassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_INVALID
                }
            });
        });

        test('should fail when email is empty string', () => {
            req.body = {
                email: ''
            };

            validateForgotPassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_REQUIRED
                }
            });
        });

        test('should accept valid email with different domains', () => {
            req.body = {
                email: 'user@company.co.uk'
            };

            validateForgotPassword(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('validateVerifyOtp', () => {
        test('should pass validation with valid email and OTP', () => {
            req.body = {
                email: 'test@example.com',
                otp: '123456'
            };

            validateVerifyOtp(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should fail when email is missing', () => {
            req.body = {
                otp: '123456'
            };

            validateVerifyOtp(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_REQUIRED
                }
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should fail when OTP is missing', () => {
            req.body = {
                email: 'test@example.com'
            };

            validateVerifyOtp(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.OTP_REQUIRED
                }
            });
        });

        test('should fail when email is invalid format', () => {
            req.body = {
                email: 'invalid-email',
                otp: '123456'
            };

            validateVerifyOtp(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_INVALID
                }
            });
        });

        test('should fail when OTP is not 6 digits', () => {
            req.body = {
                email: 'test@example.com',
                otp: '12345'
            };

            validateVerifyOtp(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.OTP_PATTERN
                }
            });
        });

        test('should fail when OTP contains non-numeric characters', () => {
            req.body = {
                email: 'test@example.com',
                otp: '12345a'
            };

            validateVerifyOtp(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.OTP_PATTERN
                }
            });
        });

        test('should fail when OTP is empty string', () => {
            req.body = {
                email: 'test@example.com',
                otp: ''
            };

            validateVerifyOtp(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.OTP_REQUIRED
                }
            });
        });

        test('should fail when both email and OTP are missing', () => {
            req.body = {};

            validateVerifyOtp(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });

        test('should accept valid OTP with all zeros', () => {
            req.body = {
                email: 'test@example.com',
                otp: '000000'
            };

            validateVerifyOtp(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('validateRefreshToken', () => {
        test('should pass validation with valid refresh token', () => {
            req.body = {
                refreshToken: 'valid-refresh-token'
            };

            validateRefreshToken(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should fail when refreshToken is missing', () => {
            req.body = {};

            validateRefreshToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.REFRESH_TOKEN_REQUIRED
                }
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should fail when refreshToken is empty string', () => {
            req.body = {
                refreshToken: ''
            };

            validateRefreshToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.REFRESH_TOKEN_REQUIRED
                }
            });
        });
    });
});
