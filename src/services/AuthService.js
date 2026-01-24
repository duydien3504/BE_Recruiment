const bcrypt = require('bcrypt');
const { UserRepository, OtpRepository, RoleRepository } = require('../repositories');
const emailService = require('../utils/emailService');
const { generateOtp, getOtpExpiration } = require('../utils/otpGenerator');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

const BCRYPT_COST = 14;

class AuthService {
    async register(registerData) {
        const { email, password, full_name, role_id } = registerData;

        // Check email exists (O(1) - Hash-based lookup)
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error(MESSAGES.EMAIL_ALREADY_EXISTS);
            error.status = HTTP_STATUS.CONFLICT;
            throw error;
        }

        // Verify role exists
        const role = await RoleRepository.findById(role_id);
        if (!role) {
            const error = new Error(MESSAGES.INVALID_ROLE);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Hash password with bcrypt cost 14
        const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

        // Create user
        const user = await UserRepository.create({
            email,
            password: hashedPassword,
            fullName: full_name,
            roleId: role_id,
            status: 'Inactive'
        });

        // Generate OTP
        const otpCode = generateOtp();
        const expiredAt = getOtpExpiration();

        // Save OTP to database
        await OtpRepository.create({
            userId: user.userId,
            code: otpCode,
            type: 'VerifyEmail',
            expiredAt
        });

        // Send OTP email (async, không block response)
        emailService.sendOtpEmail(email, otpCode, full_name)
            .catch(err => console.error('Lỗi gửi email OTP:', err.message));

        return {
            userId: user.userId,
            email: user.email
        };
    }
}

module.exports = new AuthService();
