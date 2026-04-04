const bcrypt = require('bcrypt');
const {
    UserRepository,
    OtpRepository,
    RoleRepository,
    CompanyRepository,
    TransactionRepository
} = require('../repositories');
const emailService = require('./emailService');
const jwtHelper = require('../utils/jwtHelper');
const vnpayHelper = require('../utils/vnpayHelper');
const { generateOtp, getOtpExpiration } = require('../utils/otpGenerator');
const { generatePassword } = require('../utils/passwordGenerator');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const { ROLE_NAMES, ROLES } = require('../constant/roles');
const { sequelize } = require('../config/database');
const {
    TRANSACTION_TYPES,
    TRANSACTION_STATUSES,
    PAYMENT_METHODS,
    VNPAY_RESPONSE_CODES
} = require('../constant/transactionConstants');

const BCRYPT_COST = 14;
const ACCOUNT_REGISTRATION_AMOUNT = 500000;
const USER_STATUS_ACTIVE = 'Active';
const USER_STATUS_INACTIVE = 'Inactive';
const USER_STATUS_BANNED = 'Banned';
const COMPANY_STATUS_PENDING = 'Pending';
const COMPANY_STATUS_ACTIVE = 'Active';

class AuthService {
    resolveEmployerPaymentCallbackUrl() {
        if (process.env.VNPAY_EMPLOYER_RETURN_URL) {
            return process.env.VNPAY_EMPLOYER_RETURN_URL;
        }

        if (process.env.vnp_Return_Url && process.env.vnp_Return_Url.includes('/api/v1/payments/callback')) {
            return process.env.vnp_Return_Url.replace('/api/v1/payments/callback', '/api/v1/auth/employer/payment-callback');
        }

        return process.env.vnp_Return_Url;
    }

    async register(registerData) {
        const { email, password, full_name, role_id, date_of_birth, gender } = registerData;

        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error(MESSAGES.EMAIL_ALREADY_EXISTS);
            error.status = HTTP_STATUS.CONFLICT;
            throw error;
        }

        const role = await RoleRepository.findById(role_id);
        if (!role) {
            const error = new Error(MESSAGES.INVALID_ROLE);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

        const user = await UserRepository.create({
            email,
            password: hashedPassword,
            fullName: full_name,
            roleId: role_id,
            dateOfBirth: date_of_birth || null,
            gender: gender || null,
            status: USER_STATUS_INACTIVE
        });

        const otpCode = generateOtp();
        const expiredAt = getOtpExpiration();

        await OtpRepository.create({
            userId: user.userId,
            code: otpCode,
            type: 'VerifyEmail',
            expiredAt
        });

        emailService.sendOtpEmail(email, otpCode, full_name)
            .catch(err => console.error('Lỗi gửi email OTP:', err.message));

        return {
            userId: user.userId,
            email: user.email
        };
    }

    async login(loginData) {
        const { email, password } = loginData;

        const user = await UserRepository.findByEmail(email);
        if (!user) {
            const error = new Error(MESSAGES.INVALID_CREDENTIALS);
            error.status = HTTP_STATUS.UNAUTHORIZED;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error(MESSAGES.INVALID_CREDENTIALS);
            error.status = HTTP_STATUS.UNAUTHORIZED;
            throw error;
        }

        if (user.status === USER_STATUS_BANNED) {
            const error = new Error(MESSAGES.ACCOUNT_LOCKED);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        if (user.status === USER_STATUS_INACTIVE) {
            const error = new Error(MESSAGES.ACCOUNT_NOT_VERIFIED);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        await UserRepository.update(user.userId, { lastLogin: new Date() });

        const tokenPayload = {
            userId: user.userId,
            email: user.email,
            roleId: user.roleId
        };

        const { accessToken, refreshToken } = jwtHelper.generateTokenPair(tokenPayload);

        return {
            accessToken,
            refreshToken,
            user: {
                userId: user.userId,
                role: ROLE_NAMES[user.roleId],
                fullName: user.fullName
            }
        };
    }

    async forgotPassword(forgotPasswordData) {
        const { email } = forgotPasswordData;

        const user = await UserRepository.findByEmail(email);
        if (!user) {
            const error = new Error(MESSAGES.EMAIL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const otpCode = generateOtp();
        const expiredAt = getOtpExpiration();

        await OtpRepository.create({
            userId: user.userId,
            code: otpCode,
            type: 'ResetPassword',
            expiredAt
        });

        emailService.sendForgotPasswordOtp(email, otpCode, user.fullName)
            .catch(err => console.error('Lỗi gửi email OTP quên mật khẩu:', err.message));

        return {
            email: user.email
        };
    }

    async verifyOtp(verifyOtpData) {
        const { email, otp } = verifyOtpData;

        const user = await UserRepository.findByEmail(email);
        if (!user) {
            const error = new Error(MESSAGES.EMAIL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 1. Check VerifyEmail (Register)
        const verifyOtpRecord = await OtpRepository.findValidOtp(user.userId, otp, 'VerifyEmail');
        if (verifyOtpRecord) {
            await OtpRepository.markAsUsed(verifyOtpRecord.otpId);
            await UserRepository.updateStatus(user.userId, USER_STATUS_ACTIVE);

            return {
                email: user.email,
                isVerified: true
            };
        }

        // 2. Check ResetPassword (Forgot Password)
        const resetOtpRecord = await OtpRepository.findValidOtp(user.userId, otp, 'ResetPassword');
        if (resetOtpRecord) {
            await OtpRepository.markAsUsed(resetOtpRecord.otpId);

            const resetToken = jwtHelper.generateAccessToken({
                userId: user.userId,
                email: user.email,
                purpose: 'reset-password'
            });

            return {
                resetToken,
                email: user.email
            };
        }

        // 3. Error Handling
        const usedVerifyOtp = await OtpRepository.findOne({ userId: user.userId, code: otp, type: 'VerifyEmail', isUsed: true });
        const usedResetOtp = await OtpRepository.findOne({ userId: user.userId, code: otp, type: 'ResetPassword', isUsed: true });

        if (usedVerifyOtp || usedResetOtp) {
            const error = new Error(MESSAGES.OTP_ALREADY_USED);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const expiredVerifyOtp = await OtpRepository.findOne({ userId: user.userId, code: otp, type: 'VerifyEmail' });
        const expiredResetOtp = await OtpRepository.findOne({ userId: user.userId, code: otp, type: 'ResetPassword' });

        if (expiredVerifyOtp || expiredResetOtp) {
            const error = new Error(MESSAGES.OTP_EXPIRED);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const error = new Error(MESSAGES.OTP_INVALID);
        error.status = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    async resetPassword(resetPasswordData) {
        const { email, otp } = resetPasswordData;

        const user = await UserRepository.findByEmail(email);
        if (!user) {
            const error = new Error(MESSAGES.EMAIL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const otpRecord = await OtpRepository.findValidOtp(user.userId, otp, 'ResetPassword');

        if (!otpRecord) {
            const usedOtp = await OtpRepository.findOne({
                userId: user.userId,
                code: otp,
                type: 'ResetPassword',
                isUsed: true
            });

            if (usedOtp) {
                const error = new Error(MESSAGES.OTP_ALREADY_USED);
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            const expiredOtp = await OtpRepository.findOne({
                userId: user.userId,
                code: otp,
                type: 'ResetPassword'
            });

            if (expiredOtp) {
                const error = new Error(MESSAGES.OTP_EXPIRED);
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            const error = new Error(MESSAGES.OTP_INVALID);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const newPassword = generatePassword(12);
        const hashedPassword = await bcrypt.hash(newPassword, 14);

        await UserRepository.update(user.userId, { password: hashedPassword });
        await OtpRepository.markAsUsed(otpRecord.otpId);

        emailService.sendNewPassword(email, newPassword, user.fullName)
            .catch(err => console.error('Lỗi gửi email mật khẩu mới:', err.message));

        return {
            email: user.email
        };
    }

    async refreshToken(data) {
        const { refreshToken } = data;

        try {
            const decoded = jwtHelper.verifyRefreshToken(refreshToken);
            const user = await UserRepository.findById(decoded.userId);
            // console.log('DEBUG: User found:', user);

            if (!user) {
                const error = new Error(MESSAGES.USER_NOT_FOUND);
                error.status = HTTP_STATUS.UNAUTHORIZED;
                throw error;
            }

            const accessToken = jwtHelper.generateAccessToken({
                userId: user.userId,
                role: decoded.role,
                fullName: user.fullName
            });

            return {
                accessToken
            };
        } catch (error) {
            if (error.status) throw error;
            const err = new Error(MESSAGES.INVALID_TOKEN);
            err.status = HTTP_STATUS.UNAUTHORIZED;
            throw err;
        }
    }

    async logout(data) {
        // Stateless logout: Client xóa token
        // Có thể mở rộng bằng cách thêm Blacklist token vào Redis hoặc DB
        const { refreshToken } = data;
        try {
            // Verify để đảm bảo request hợp lệ
            jwtHelper.verifyRefreshToken(refreshToken);
            return true;
        } catch (error) {
            // Vẫn trả về success để client clear token dù token lỗi
            return true;
        }
    }

    async registerEmployerAndCreatePayment(params) {
        const { email, password, fullName, companyName, taxCode, phoneNumber, ipAddr } = params;

        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error(MESSAGES.EMAIL_ALREADY_EXISTS);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const existingCompany = await CompanyRepository.findByTaxCode(taxCode);
        if (existingCompany) {
            const error = new Error(MESSAGES.TAX_CODE_EXISTS);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const employerRole = await RoleRepository.findById(ROLES.EMPLOYER);
        if (!employerRole) {
            const error = new Error(MESSAGES.INVALID_ROLE);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

        const result = await sequelize.transaction(async (databaseTransaction) => {
            const user = await UserRepository.create({
                email,
                password: hashedPassword,
                fullName,
                phoneNumber,
                roleId: ROLES.EMPLOYER,
                status: USER_STATUS_INACTIVE
            }, { transaction: databaseTransaction });

            const company = await CompanyRepository.create({
                userId: user.userId,
                name: companyName,
                taxCode,
                phoneNumber,
                status: COMPANY_STATUS_PENDING
            }, { transaction: databaseTransaction });

            const transaction = await TransactionRepository.create({
                companyId: company.companyId,
                jobPostId: null,
                amount: ACCOUNT_REGISTRATION_AMOUNT,
                paymentMethod: PAYMENT_METHODS.VNPAY,
                transactionType: TRANSACTION_TYPES.ACCOUNT_REGISTRATION,
                status: TRANSACTION_STATUSES.PENDING
            }, { transaction: databaseTransaction });

            const paymentUrl = vnpayHelper.createPaymentUrl({
                amount: ACCOUNT_REGISTRATION_AMOUNT,
                orderInfo: `ThanhToanDangKyNhaTuyenDung${transaction.transactionId}`,
                orderId: transaction.transactionId.toString(),
                ipAddr,
                returnUrl: this.resolveEmployerPaymentCallbackUrl()
            });

            return {
                transactionId: transaction.transactionId,
                paymentUrl
            };
        });

        return result;
    }

    async handleEmployerPaymentCallback(vnpParams) {
        const { isValid, data } = vnpayHelper.verifyCallback({ ...vnpParams });

        if (!isValid) {
            const error = new Error(MESSAGES.PAYMENT_SIGNATURE_INVALID);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const transaction = await TransactionRepository.findById(data.orderId);
        if (!transaction) {
            const error = new Error('Không tìm thấy giao dịch.');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (transaction.transactionType !== TRANSACTION_TYPES.ACCOUNT_REGISTRATION) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        if (data.responseCode === VNPAY_RESPONSE_CODES.SUCCESS) {
            const callbackResult = await sequelize.transaction(async (databaseTransaction) => {
                await TransactionRepository.update(transaction.transactionId, {
                    status: TRANSACTION_STATUSES.SUCCESS
                }, { transaction: databaseTransaction });

                const company = await CompanyRepository.findById(transaction.companyId, { transaction: databaseTransaction });
                if (!company) {
                    const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
                    error.status = HTTP_STATUS.NOT_FOUND;
                    throw error;
                }

                await CompanyRepository.updateStatus(company.companyId, COMPANY_STATUS_ACTIVE, { transaction: databaseTransaction });
                await UserRepository.updateStatus(company.userId, USER_STATUS_ACTIVE, { transaction: databaseTransaction });

                return {
                    success: true,
                    userId: company.userId,
                    companyId: company.companyId
                };
            });

            return callbackResult;
        }

        await TransactionRepository.update(transaction.transactionId, {
            status: TRANSACTION_STATUSES.FAILED
        });

        return {
            success: false
        };
    }
}

module.exports = new AuthService();
