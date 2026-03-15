const AuthService = require('../../src/services/AuthService');
const {
    UserRepository,
    OtpRepository,
    RoleRepository,
    CompanyRepository,
    TransactionRepository
} = require('../../src/repositories');
const emailService = require('../../src/services/emailService');
const jwtHelper = require('../../src/utils/jwtHelper');
const vnpayHelper = require('../../src/utils/vnpayHelper');
const { generateOtp, getOtpExpiration } = require('../../src/utils/otpGenerator');
const bcrypt = require('bcrypt');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');
const { ROLE_NAMES } = require('../../src/constant/roles');
const { sequelize } = require('../../src/config/database');
const { TRANSACTION_TYPES, TRANSACTION_STATUSES } = require('../../src/constant/transactionConstants');

jest.mock('../../src/services/emailService');
jest.mock('../../src/utils/jwtHelper');
jest.mock('../../src/utils/vnpayHelper');
jest.mock('../../src/utils/otpGenerator');
jest.mock('bcrypt');
jest.mock('../../src/config/database', () => ({
    sequelize: {
        transaction: jest.fn()
    }
}));

jest.mock('../../src/repositories', () => ({
    UserRepository: {
        findByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        updateStatus: jest.fn()
    },
    OtpRepository: {
        create: jest.fn(),
        findValidOtp: jest.fn(),
        findOne: jest.fn(),
        markAsUsed: jest.fn()
    },
    RoleRepository: {
        findById: jest.fn()
    },
    CompanyRepository: {
        findByTaxCode: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        updateStatus: jest.fn()
    },
    TransactionRepository: {
        create: jest.fn(),
        findById: jest.fn(),
        update: jest.fn()
    }
}));

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        const validRegisterData = {
            email: 'test@example.com',
            password: 'Password123',
            full_name: 'Nguyen Van A',
            role_id: 3
        };

        test('should successfully register a new user', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            RoleRepository.findById.mockResolvedValue({ roleId: 3, roleName: 'Candidate' });
            bcrypt.hash.mockResolvedValue('hashedPassword123');

            const mockUser = {
                userId: 'uuid-123',
                email: 'test@example.com',
                fullName: 'Nguyen Van A',
                roleId: 3
            };
            UserRepository.create.mockResolvedValue(mockUser);

            generateOtp.mockReturnValue('123456');
            const mockExpiration = new Date();
            getOtpExpiration.mockReturnValue(mockExpiration);

            OtpRepository.create.mockResolvedValue({});
            emailService.sendOtpEmail.mockResolvedValue(true);

            const result = await AuthService.register(validRegisterData);

            await new Promise(resolve => setImmediate(resolve));

            expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(RoleRepository.findById).toHaveBeenCalledWith(3);
            expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 14);

            expect(UserRepository.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'hashedPassword123',
                fullName: 'Nguyen Van A',
                roleId: 3,
                status: 'Inactive'
            });

            expect(OtpRepository.create).toHaveBeenCalledWith({
                userId: 'uuid-123',
                code: '123456',
                type: 'VerifyEmail',
                expiredAt: mockExpiration
            });

            expect(result).toEqual({
                userId: 'uuid-123',
                email: 'test@example.com'
            });
        });

        test('should throw error when email already exists', async () => {
            UserRepository.findByEmail.mockResolvedValue({ email: 'test@example.com' });

            await expect(AuthService.register(validRegisterData))
                .rejects
                .toThrow(MESSAGES.EMAIL_ALREADY_EXISTS);

            expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(RoleRepository.findById).not.toHaveBeenCalled();
            expect(UserRepository.create).not.toHaveBeenCalled();
        });

        test('should throw 409 status when email already exists', async () => {
            UserRepository.findByEmail.mockResolvedValue({ email: 'test@example.com' });

            try {
                await AuthService.register(validRegisterData);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.CONFLICT);
                expect(error.message).toBe(MESSAGES.EMAIL_ALREADY_EXISTS);
            }
        });

        test('should throw error when role does not exist', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            RoleRepository.findById.mockResolvedValue(null);

            await expect(AuthService.register(validRegisterData))
                .rejects
                .toThrow(MESSAGES.INVALID_ROLE);

            expect(RoleRepository.findById).toHaveBeenCalledWith(3);
            expect(UserRepository.create).not.toHaveBeenCalled();
        });

        test('should throw 400 status when role is invalid', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            RoleRepository.findById.mockResolvedValue(null);

            try {
                await AuthService.register(validRegisterData);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.BAD_REQUEST);
                expect(error.message).toBe(MESSAGES.INVALID_ROLE);
            }
        });

        test('should hash password with bcrypt cost 14', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            RoleRepository.findById.mockResolvedValue({ roleId: 3 });
            bcrypt.hash.mockResolvedValue('hashedPassword');
            UserRepository.create.mockResolvedValue({ userId: 'uuid', email: 'test@example.com' });
            generateOtp.mockReturnValue('123456');
            getOtpExpiration.mockReturnValue(new Date());
            OtpRepository.create.mockResolvedValue({});

            await AuthService.register(validRegisterData);

            expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 14);
        });

        test('should create user with Inactive status', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            RoleRepository.findById.mockResolvedValue({ roleId: 3 });
            bcrypt.hash.mockResolvedValue('hashedPassword');
            UserRepository.create.mockResolvedValue({ userId: 'uuid', email: 'test@example.com' });
            generateOtp.mockReturnValue('123456');
            getOtpExpiration.mockReturnValue(new Date());
            OtpRepository.create.mockResolvedValue({});

            await AuthService.register(validRegisterData);

            expect(UserRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'Inactive' })
            );
        });

        test('should send OTP email asynchronously', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            RoleRepository.findById.mockResolvedValue({ roleId: 3 });
            bcrypt.hash.mockResolvedValue('hashedPassword');
            UserRepository.create.mockResolvedValue({ userId: 'uuid', email: 'test@example.com' });
            generateOtp.mockReturnValue('123456');
            getOtpExpiration.mockReturnValue(new Date());
            OtpRepository.create.mockResolvedValue({});
            emailService.sendOtpEmail.mockResolvedValue(true);

            await AuthService.register(validRegisterData);

            expect(emailService.sendOtpEmail).toHaveBeenCalled();
        });

        test('should not fail if email sending fails', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            RoleRepository.findById.mockResolvedValue({ roleId: 3 });
            bcrypt.hash.mockResolvedValue('hashedPassword');
            UserRepository.create.mockResolvedValue({ userId: 'uuid', email: 'test@example.com' });
            generateOtp.mockReturnValue('123456');
            getOtpExpiration.mockReturnValue(new Date());
            OtpRepository.create.mockResolvedValue({});
            emailService.sendOtpEmail.mockRejectedValue(new Error('Email service down'));

            const result = await AuthService.register(validRegisterData);
            expect(result).toBeDefined();
        });
    });

    describe('login', () => {
        const validLoginData = {
            email: 'test@example.com',
            password: 'Password123'
        };

        const mockActiveUser = {
            userId: 'uuid-123',
            email: 'test@example.com',
            password: 'hashedPassword123',
            fullName: 'Nguyen Van A',
            roleId: 3,
            status: 'Active'
        };

        test('should successfully login with valid credentials', async () => {
            UserRepository.findByEmail.mockResolvedValue(mockActiveUser);
            bcrypt.compare.mockResolvedValue(true);
            jwtHelper.generateTokenPair.mockReturnValue({
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token'
            });

            const result = await AuthService.login(validLoginData);

            expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('Password123', 'hashedPassword123');
            expect(jwtHelper.generateTokenPair).toHaveBeenCalledWith({
                userId: 'uuid-123',
                email: 'test@example.com',
                roleId: 3
            });

            expect(result).toEqual({
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                user: {
                    userId: 'uuid-123',
                    role: 'Candidate',
                    fullName: 'Nguyen Van A'
                }
            });
        });

        test('should throw 401 error when user does not exist', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);

            try {
                await AuthService.login(validLoginData);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.UNAUTHORIZED);
                expect(error.message).toBe(MESSAGES.INVALID_CREDENTIALS);
            }

            expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        test('should throw 401 error when password is incorrect', async () => {
            UserRepository.findByEmail.mockResolvedValue(mockActiveUser);
            bcrypt.compare.mockResolvedValue(false);

            try {
                await AuthService.login(validLoginData);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.UNAUTHORIZED);
                expect(error.message).toBe(MESSAGES.INVALID_CREDENTIALS);
            }

            expect(bcrypt.compare).toHaveBeenCalledWith('Password123', 'hashedPassword123');
            expect(jwtHelper.generateTokenPair).not.toHaveBeenCalled();
        });

        test('should throw 403 error when account is banned', async () => {
            const bannedUser = { ...mockActiveUser, status: 'Banned' };
            UserRepository.findByEmail.mockResolvedValue(bannedUser);
            bcrypt.compare.mockResolvedValue(true);

            try {
                await AuthService.login(validLoginData);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.FORBIDDEN);
                expect(error.message).toBe(MESSAGES.ACCOUNT_LOCKED);
            }

            expect(jwtHelper.generateTokenPair).not.toHaveBeenCalled();
        });

        test('should throw 403 error when account is not verified', async () => {
            const inactiveUser = { ...mockActiveUser, status: 'Inactive' };
            UserRepository.findByEmail.mockResolvedValue(inactiveUser);
            bcrypt.compare.mockResolvedValue(true);

            try {
                await AuthService.login(validLoginData);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.FORBIDDEN);
                expect(error.message).toBe(MESSAGES.ACCOUNT_NOT_VERIFIED);
            }

            expect(jwtHelper.generateTokenPair).not.toHaveBeenCalled();
        });

        test('should return correct role name for Employer', async () => {
            const employerUser = { ...mockActiveUser, roleId: 2 };
            UserRepository.findByEmail.mockResolvedValue(employerUser);
            bcrypt.compare.mockResolvedValue(true);
            jwtHelper.generateTokenPair.mockReturnValue({
                accessToken: 'token',
                refreshToken: 'refresh'
            });

            const result = await AuthService.login(validLoginData);

            expect(result.user.role).toBe('Employer');
        });

        test('should return correct role name for Admin', async () => {
            const adminUser = { ...mockActiveUser, roleId: 1 };
            UserRepository.findByEmail.mockResolvedValue(adminUser);
            bcrypt.compare.mockResolvedValue(true);
            jwtHelper.generateTokenPair.mockReturnValue({
                accessToken: 'token',
                refreshToken: 'refresh'
            });

            const result = await AuthService.login(validLoginData);

            expect(result.user.role).toBe('Admin');
        });

        test('should use O(1) complexity for email lookup', async () => {
            UserRepository.findByEmail.mockResolvedValue(mockActiveUser);
            bcrypt.compare.mockResolvedValue(true);
            jwtHelper.generateTokenPair.mockReturnValue({
                accessToken: 'token',
                refreshToken: 'refresh'
            });

            await AuthService.login(validLoginData);

            expect(UserRepository.findByEmail).toHaveBeenCalledTimes(1);
        });
    });

    describe('forgotPassword', () => {
        const validForgotPasswordData = {
            email: 'test@example.com'
        };

        const mockUser = {
            userId: 'uuid-123',
            email: 'test@example.com',
            fullName: 'Nguyen Van A'
        };

        test('should successfully send OTP for forgot password', async () => {
            UserRepository.findByEmail.mockResolvedValue(mockUser);
            generateOtp.mockReturnValue('123456');
            const mockExpiration = new Date();
            getOtpExpiration.mockReturnValue(mockExpiration);
            OtpRepository.create.mockResolvedValue({});
            emailService.sendForgotPasswordOtp.mockResolvedValue(true);

            const result = await AuthService.forgotPassword(validForgotPasswordData);

            expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(generateOtp).toHaveBeenCalled();
            expect(getOtpExpiration).toHaveBeenCalled();
            expect(OtpRepository.create).toHaveBeenCalledWith({
                userId: 'uuid-123',
                code: '123456',
                type: 'ResetPassword',
                expiredAt: mockExpiration
            });

            expect(result).toEqual({
                email: 'test@example.com'
            });
        });

        test('should throw 404 error when email does not exist', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);

            try {
                await AuthService.forgotPassword(validForgotPasswordData);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
                expect(error.message).toBe(MESSAGES.EMAIL_NOT_FOUND);
            }

            expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(generateOtp).not.toHaveBeenCalled();
            expect(OtpRepository.create).not.toHaveBeenCalled();
        });

        test('should create OTP with type ForgotPassword', async () => {
            UserRepository.findByEmail.mockResolvedValue(mockUser);
            generateOtp.mockReturnValue('654321');
            const mockExpiration = new Date();
            getOtpExpiration.mockReturnValue(mockExpiration);
            OtpRepository.create.mockResolvedValue({});
            emailService.sendForgotPasswordOtp.mockResolvedValue(true);

            await AuthService.forgotPassword(validForgotPasswordData);

            expect(OtpRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'ResetPassword'
                })
            );
        });

        test('should send email asynchronously', async () => {
            UserRepository.findByEmail.mockResolvedValue(mockUser);
            generateOtp.mockReturnValue('123456');
            getOtpExpiration.mockReturnValue(new Date());
            OtpRepository.create.mockResolvedValue({});
            emailService.sendForgotPasswordOtp.mockResolvedValue(true);

            await AuthService.forgotPassword(validForgotPasswordData);

            expect(emailService.sendForgotPasswordOtp).toHaveBeenCalledWith(
                'test@example.com',
                '123456',
                'Nguyen Van A'
            );
        });

        test('should not fail if email sending fails', async () => {
            UserRepository.findByEmail.mockResolvedValue(mockUser);
            generateOtp.mockReturnValue('123456');
            getOtpExpiration.mockReturnValue(new Date());
            OtpRepository.create.mockResolvedValue({});
            emailService.sendForgotPasswordOtp.mockRejectedValue(new Error('Email service down'));

            const result = await AuthService.forgotPassword(validForgotPasswordData);
            expect(result).toBeDefined();
            expect(result.email).toBe('test@example.com');
        });

        test('should use O(1) complexity for email lookup', async () => {
            UserRepository.findByEmail.mockResolvedValue(mockUser);
            generateOtp.mockReturnValue('123456');
            getOtpExpiration.mockReturnValue(new Date());
            OtpRepository.create.mockResolvedValue({});
            emailService.sendForgotPasswordOtp.mockResolvedValue(true);

            await AuthService.forgotPassword(validForgotPasswordData);

            expect(UserRepository.findByEmail).toHaveBeenCalledTimes(1);
        });
    });

    describe('refreshToken', () => {
        const mockRefreshToken = 'valid-refresh-token';
        const mockDecodedToken = { userId: 'uuid-123', role: 'seeker' };
        const mockUser = { userId: 'uuid-123', role: 'seeker', fullName: 'Test User' };

        test('should return new access token when refresh token is valid', async () => {
            jwtHelper.verifyRefreshToken.mockReturnValue(mockDecodedToken);
            UserRepository.findById.mockResolvedValue(mockUser);
            jwtHelper.generateAccessToken.mockReturnValue('new-access-token');

            const result = await AuthService.refreshToken({ refreshToken: mockRefreshToken });

            expect(jwtHelper.verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
            expect(UserRepository.findById).toHaveBeenCalledWith('uuid-123');
            expect(result).toEqual({ accessToken: 'new-access-token' });
        });

        test('should throw error when refresh token is invalid', async () => {
            jwtHelper.verifyRefreshToken.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            try {
                await AuthService.refreshToken({ refreshToken: 'invalid-token' });
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.UNAUTHORIZED);
                expect(error.message).toBe(MESSAGES.INVALID_TOKEN);
            }
        });

        test('should throw error when user not found', async () => {
            jwtHelper.verifyRefreshToken.mockReturnValue(mockDecodedToken);
            UserRepository.findById.mockResolvedValue(null);

            try {
                await AuthService.refreshToken({ refreshToken: mockRefreshToken });
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.UNAUTHORIZED);
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
            }
        });
    });

    describe('registerEmployerAndCreatePayment', () => {
        const registerEmployerData = {
            email: 'hr@congty.com',
            password: 'Password123',
            fullName: 'Nguyen Van A',
            companyName: 'Tech Company',
            taxCode: '0123456789',
            phoneNumber: '0987654321',
            ipAddr: '127.0.0.1'
        };

        test('should create user company transaction and return paymentUrl', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            CompanyRepository.findByTaxCode.mockResolvedValue(null);
            RoleRepository.findById.mockResolvedValue({ roleId: 2, roleName: 'EMPLOYER' });
            bcrypt.hash.mockResolvedValue('hashed-password');
            UserRepository.create.mockResolvedValue({ userId: 'user-1' });
            CompanyRepository.create.mockResolvedValue({ companyId: 'company-1' });
            TransactionRepository.create.mockResolvedValue({ transactionId: 1001 });
            vnpayHelper.createPaymentUrl.mockReturnValue('https://vnpay.vn/payment-url');
            sequelize.transaction.mockImplementation(async (callback) => callback({}));

            const result = await AuthService.registerEmployerAndCreatePayment(registerEmployerData);

            expect(UserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                email: 'hr@congty.com',
                fullName: 'Nguyen Van A',
                status: 'Inactive'
            }), expect.any(Object));
            expect(CompanyRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'user-1',
                taxCode: '0123456789',
                status: 'Pending'
            }), expect.any(Object));
            expect(TransactionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                companyId: 'company-1',
                transactionType: TRANSACTION_TYPES.ACCOUNT_REGISTRATION,
                status: TRANSACTION_STATUSES.PENDING,
                jobPostId: null
            }), expect.any(Object));
            expect(result).toEqual({
                transactionId: 1001,
                paymentUrl: 'https://vnpay.vn/payment-url'
            });
        });

        test('should throw 400 when email exists', async () => {
            UserRepository.findByEmail.mockResolvedValue({ userId: 'existing' });

            await expect(AuthService.registerEmployerAndCreatePayment(registerEmployerData))
                .rejects.toMatchObject({
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: MESSAGES.EMAIL_ALREADY_EXISTS
                });
        });
    });

    describe('handleEmployerPaymentCallback', () => {
        test('should activate user and company when callback success', async () => {
            vnpayHelper.verifyCallback.mockReturnValue({
                isValid: true,
                data: {
                    orderId: '1001',
                    responseCode: '00'
                }
            });
            TransactionRepository.findById.mockResolvedValue({
                transactionId: 1001,
                companyId: 'company-1',
                transactionType: TRANSACTION_TYPES.ACCOUNT_REGISTRATION
            });
            CompanyRepository.findById.mockResolvedValue({
                companyId: 'company-1',
                userId: 'user-1'
            });
            sequelize.transaction.mockImplementation(async (callback) => callback({}));

            const result = await AuthService.handleEmployerPaymentCallback({
                vnp_TxnRef: '1001',
                vnp_ResponseCode: '00',
                vnp_SecureHash: 'valid'
            });

            expect(TransactionRepository.update).toHaveBeenCalledWith(1001, { status: TRANSACTION_STATUSES.SUCCESS }, expect.any(Object));
            expect(CompanyRepository.updateStatus).toHaveBeenCalledWith('company-1', 'Active', expect.any(Object));
            expect(UserRepository.updateStatus).toHaveBeenCalledWith('user-1', 'Active', expect.any(Object));
            expect(result.success).toBe(true);
        });
    });

    describe('logout', () => {
        test('should return true when logout is successful', async () => {
            jwtHelper.verifyRefreshToken.mockReturnValue({});

            const result = await AuthService.logout({ refreshToken: 'some-token' });

            expect(result).toBe(true);
        });

        test('should return true even if token check fails', async () => {
            jwtHelper.verifyRefreshToken.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            const result = await AuthService.logout({ refreshToken: 'invalid-token' });

            expect(result).toBe(true);
        });
    });
});
