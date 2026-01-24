const AuthService = require('../../src/services/AuthService');
const { UserRepository, OtpRepository, RoleRepository } = require('../../src/repositories');
const emailService = require('../../src/utils/emailService');
const { generateOtp, getOtpExpiration } = require('../../src/utils/otpGenerator');
const bcrypt = require('bcrypt');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

// Mock dependencies
jest.mock('../../src/utils/emailService');
jest.mock('../../src/utils/otpGenerator');
jest.mock('bcrypt');

// Mock repository methods
jest.mock('../../src/repositories', () => ({
    UserRepository: {
        findByEmail: jest.fn(),
        create: jest.fn()
    },
    OtpRepository: {
        create: jest.fn()
    },
    RoleRepository: {
        findById: jest.fn()
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
            // Mock dependencies
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

            // Execute
            const result = await AuthService.register(validRegisterData);

            // Wait for async email sending to complete
            await new Promise(resolve => setImmediate(resolve));

            // Assertions
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

            // Email sending is async, so we just verify it was called
            // The actual sending happens in background
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

            // Should not throw error even if email fails
            const result = await AuthService.register(validRegisterData);
            expect(result).toBeDefined();
        });
    });
});
