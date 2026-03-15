const AuthController = require('../../src/controllers/AuthController');
const AuthService = require('../../src/services/AuthService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/AuthService');

describe('AuthController', () => {
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

    describe('register', () => {
        test('should return 201 and success message on successful registration', async () => {
            const mockResult = {
                userId: 'uuid-123',
                email: 'test@example.com'
            };

            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 3
            };

            AuthService.register.mockResolvedValue(mockResult);

            await AuthController.register(req, res, next);

            expect(AuthService.register).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.REGISTER_SUCCESS,
                data: mockResult
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service throws error', async () => {
            const mockError = new Error('Email already exists');
            mockError.status = HTTP_STATUS.CONFLICT;

            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 3
            };

            AuthService.register.mockRejectedValue(mockError);

            await AuthController.register(req, res, next);

            expect(AuthService.register).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should pass error to error handler middleware', async () => {
            const mockError = new Error('Database error');

            AuthService.register.mockRejectedValue(mockError);

            await AuthController.register(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('login', () => {
        test('should return 200 and success message on successful login', async () => {
            const mockResult = {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                user: {
                    userId: 'uuid-123',
                    role: 'Candidate',
                    fullName: 'Nguyen Van A'
                }
            };

            req.body = {
                email: 'test@example.com',
                password: 'Password123'
            };

            AuthService.login.mockResolvedValue(mockResult);

            await AuthController.login(req, res, next);

            expect(AuthService.login).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.LOGIN_SUCCESS,
                data: mockResult
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when credentials are invalid', async () => {
            const mockError = new Error(MESSAGES.INVALID_CREDENTIALS);
            mockError.status = HTTP_STATUS.UNAUTHORIZED;

            req.body = {
                email: 'test@example.com',
                password: 'WrongPassword'
            };

            AuthService.login.mockRejectedValue(mockError);

            await AuthController.login(req, res, next);

            expect(AuthService.login).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should call next with error when account is locked', async () => {
            const mockError = new Error(MESSAGES.ACCOUNT_LOCKED);
            mockError.status = HTTP_STATUS.FORBIDDEN;

            req.body = {
                email: 'banned@example.com',
                password: 'Password123'
            };

            AuthService.login.mockRejectedValue(mockError);

            await AuthController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should call next with error when account is not verified', async () => {
            const mockError = new Error(MESSAGES.ACCOUNT_NOT_VERIFIED);
            mockError.status = HTTP_STATUS.FORBIDDEN;

            req.body = {
                email: 'inactive@example.com',
                password: 'Password123'
            };

            AuthService.login.mockRejectedValue(mockError);

            await AuthController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });

        test('should pass any service error to error handler middleware', async () => {
            const mockError = new Error('Database connection failed');

            AuthService.login.mockRejectedValue(mockError);

            await AuthController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });

        test('should not call response methods when error occurs', async () => {
            const mockError = new Error('Some error');
            AuthService.login.mockRejectedValue(mockError);

            await AuthController.login(req, res, next);

            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('forgotPassword', () => {
        test('should return 200 and success message on successful OTP send', async () => {
            const mockResult = {
                email: 'test@example.com'
            };

            req.body = {
                email: 'test@example.com'
            };

            AuthService.forgotPassword.mockResolvedValue(mockResult);

            await AuthController.forgotPassword(req, res, next);

            expect(AuthService.forgotPassword).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.OTP_SENT_SUCCESS,
                data: mockResult
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when email not found', async () => {
            const mockError = new Error(MESSAGES.EMAIL_NOT_FOUND);
            mockError.status = HTTP_STATUS.NOT_FOUND;

            req.body = {
                email: 'notfound@example.com'
            };

            AuthService.forgotPassword.mockRejectedValue(mockError);

            await AuthController.forgotPassword(req, res, next);

            expect(AuthService.forgotPassword).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should pass any service error to error handler middleware', async () => {
            const mockError = new Error('Database connection failed');

            AuthService.forgotPassword.mockRejectedValue(mockError);

            await AuthController.forgotPassword(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });

        test('should not call response methods when error occurs', async () => {
            const mockError = new Error('Some error');
            AuthService.forgotPassword.mockRejectedValue(mockError);

            await AuthController.forgotPassword(req, res, next);

            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('registerEmployer', () => {
        test('should return 200 with paymentUrl when successful', async () => {
            req.body = {
                email: 'hr@congty.com',
                password: 'Password123',
                fullName: 'Nguyen Van A',
                companyName: 'Tech Company',
                taxCode: '0123456789',
                phoneNumber: '0987654321'
            };
            req.headers = { 'x-forwarded-for': '10.0.0.1' };
            const mockResult = {
                paymentUrl: 'https://vnpay.vn/payment-url',
                transactionId: 1001
            };
            AuthService.registerEmployerAndCreatePayment.mockResolvedValue(mockResult);

            await AuthController.registerEmployer(req, res, next);

            expect(AuthService.registerEmployerAndCreatePayment).toHaveBeenCalledWith({
                ...req.body,
                ipAddr: '10.0.0.1'
            });
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: MESSAGES.EMPLOYER_REGISTER_INIT_SUCCESS,
                data: {
                    paymentUrl: 'https://vnpay.vn/payment-url',
                    transactionId: 1001
                }
            });
        });
    });

    describe('employerPaymentCallback', () => {
        test('should return success response when callback success', async () => {
            req.query = {
                vnp_TxnRef: '1001',
                vnp_ResponseCode: '00',
                vnp_SecureHash: 'hash'
            };
            AuthService.handleEmployerPaymentCallback.mockResolvedValue({
                success: true,
                userId: 'user-1',
                companyId: 'company-1'
            });

            await AuthController.employerPaymentCallback(req, res, next);

            expect(AuthService.handleEmployerPaymentCallback).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: MESSAGES.EMPLOYER_ACCOUNT_ACTIVATED_SUCCESS,
                data: {
                    userId: 'user-1',
                    companyId: 'company-1'
                }
            });
        });
    });

    describe('refreshToken', () => {
        test('should return 200 and access token when successful', async () => {
            const mockResult = { accessToken: 'new-access-token' };
            req.body = { refreshToken: 'valid-token' };
            AuthService.refreshToken.mockResolvedValue(mockResult);

            await AuthController.refreshToken(req, res, next);

            expect(AuthService.refreshToken).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.REFRESH_TOKEN_SUCCESS,
                data: mockResult
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error(MESSAGES.INVALID_TOKEN);
            mockError.status = HTTP_STATUS.UNAUTHORIZED;
            AuthService.refreshToken.mockRejectedValue(mockError);

            await AuthController.refreshToken(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('logout', () => {
        test('should return 200 and success message', async () => {
            req.body = { refreshToken: 'some-token' };
            AuthService.logout.mockResolvedValue(true);

            await AuthController.logout(req, res, next);

            expect(AuthService.logout).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.LOGOUT_SUCCESS
            });
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error('Some error');
            AuthService.logout.mockRejectedValue(mockError);

            await AuthController.logout(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });
});
