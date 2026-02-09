const AuthService = require('../../src/services/AuthService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/emailService');
jest.mock('../../src/utils/jwtHelper');
jest.mock('../../src/utils/otpGenerator');
jest.mock('bcrypt');

jest.mock('../../src/repositories', () => ({
    UserRepository: {
        findByEmail: jest.fn(),
        updateStatus: jest.fn(),
        update: jest.fn()
    },
    OtpRepository: {
        findValidOtp: jest.fn(),
        markAsUsed: jest.fn(),
        findOne: jest.fn()
    }
}));

const { UserRepository, OtpRepository } = require('../../src/repositories');
const jwtHelper = require('../../src/utils/jwtHelper');

describe('AuthService.verifyOtp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const verifyOtpData = {
        email: 'test@example.com',
        otp: '123456'
    };

    const mockUser = {
        userId: 'uuid-123',
        email: 'test@example.com',
        status: 'Inactive'
    };

    test('should successfully verify email (VerifyEmail)', async () => {
        UserRepository.findByEmail.mockResolvedValue(mockUser);

        // Mock VerifyEmail OTP found
        OtpRepository.findValidOtp.mockImplementation((userId, otp, type) => {
            if (type === 'VerifyEmail') return Promise.resolve({ otpId: 1 });
            return Promise.resolve(null);
        });

        // Mock ResetPassword OTP not found
        // logic handled by implementation above

        const result = await AuthService.verifyOtp(verifyOtpData);

        expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(OtpRepository.findValidOtp).toHaveBeenCalledWith('uuid-123', '123456', 'VerifyEmail');
        expect(OtpRepository.markAsUsed).toHaveBeenCalledWith(1);
        expect(UserRepository.updateStatus).toHaveBeenCalledWith('uuid-123', 'Active');

        expect(result).toEqual({
            email: 'test@example.com',
            isVerified: true
        });
    });

    test('should successfully verify reset password (ResetPassword)', async () => {
        UserRepository.findByEmail.mockResolvedValue(mockUser);

        // Mock VerifyEmail not found, ResetPassword found
        OtpRepository.findValidOtp.mockImplementation((userId, otp, type) => {
            if (type === 'ResetPassword') return Promise.resolve({ otpId: 2 });
            return Promise.resolve(null);
        });

        jwtHelper.generateAccessToken.mockReturnValue('mock-reset-token');

        const result = await AuthService.verifyOtp(verifyOtpData);

        expect(OtpRepository.findValidOtp).toHaveBeenCalledWith('uuid-123', '123456', 'VerifyEmail');
        expect(OtpRepository.findValidOtp).toHaveBeenCalledWith('uuid-123', '123456', 'ResetPassword');
        expect(OtpRepository.markAsUsed).toHaveBeenCalledWith(2);

        expect(result).toEqual({
            resetToken: 'mock-reset-token',
            email: 'test@example.com'
        });
    });

    test('should throw error when email not found', async () => {
        UserRepository.findByEmail.mockResolvedValue(null);

        await expect(AuthService.verifyOtp(verifyOtpData))
            .rejects
            .toMatchObject({
                message: MESSAGES.EMAIL_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            });
    });

    test('should throw error when no valid OTP found and no specific error conditions met', async () => {
        UserRepository.findByEmail.mockResolvedValue(mockUser);
        OtpRepository.findValidOtp.mockResolvedValue(null);
        OtpRepository.findOne.mockResolvedValue(null); // No used or expired OTPs found

        await expect(AuthService.verifyOtp(verifyOtpData))
            .rejects
            .toMatchObject({
                message: MESSAGES.OTP_INVALID,
                status: HTTP_STATUS.BAD_REQUEST
            });
    });

    test('should verify error priority: Already Used > Expired', async () => {
        UserRepository.findByEmail.mockResolvedValue(mockUser);
        OtpRepository.findValidOtp.mockResolvedValue(null);

        // Simulate used OTP
        OtpRepository.findOne.mockImplementation(({ isUsed }) => {
            if (isUsed) return Promise.resolve({ otpId: 1, isUsed: true });
            return Promise.resolve(null);
        });

        await expect(AuthService.verifyOtp(verifyOtpData))
            .rejects
            .toMatchObject({
                message: MESSAGES.OTP_ALREADY_USED,
                status: HTTP_STATUS.BAD_REQUEST
            });
    });

    test('should verify error priority: Expired', async () => {
        UserRepository.findByEmail.mockResolvedValue(mockUser);
        OtpRepository.findValidOtp.mockResolvedValue(null);

        // Simulate expired OTP (not used, but found via findOne meaning it exists)
        OtpRepository.findOne.mockImplementation(({ isUsed, type }) => {
            // First call checks for used (returns null)
            if (isUsed) return Promise.resolve(null);
            // Second call checks for existence (returns object -> implies expired since passed findValidOtp check)
            return Promise.resolve({ otpId: 1 });
        });

        await expect(AuthService.verifyOtp(verifyOtpData))
            .rejects
            .toMatchObject({
                message: MESSAGES.OTP_EXPIRED,
                status: HTTP_STATUS.BAD_REQUEST
            });
    });
});
