const AuthService = require('../services/AuthService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

const resolveClientIp = (req) => {
    const forwardedIp = req.headers['x-forwarded-for'];
    if (forwardedIp) {
        return String(forwardedIp).split(',')[0].trim();
    }

    return req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress ||
        '127.0.0.1';
};

class AuthController {
    async register(req, res, next) {
        try {
            const result = await AuthService.register(req.body);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.REGISTER_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const result = await AuthService.login(req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.LOGIN_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const result = await AuthService.forgotPassword(req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.OTP_SENT_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyOtp(req, res, next) {
        try {
            const result = await AuthService.verifyOtp(req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.OTP_VERIFY_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const result = await AuthService.resetPassword(req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.PASSWORD_RESET_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const result = await AuthService.refreshToken(req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.REFRESH_TOKEN_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            await AuthService.logout(req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.LOGOUT_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    async registerEmployer(req, res, next) {
        try {
            const ipAddr = resolveClientIp(req);
            const result = await AuthService.registerEmployerAndCreatePayment({
                ...req.body,
                ipAddr
            });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.EMPLOYER_REGISTER_INIT_SUCCESS,
                data: {
                    paymentUrl: result.paymentUrl,
                    transactionId: result.transactionId
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async employerPaymentCallback(req, res, next) {
        try {
            const result = await AuthService.handleEmployerPaymentCallback(req.query);
            const message = result.success
                ? MESSAGES.EMPLOYER_ACCOUNT_ACTIVATED_SUCCESS
                : MESSAGES.PAYMENT_FAILED;

            return res.status(HTTP_STATUS.OK).json({
                success: result.success,
                message,
                data: result.success
                    ? {
                        userId: result.userId,
                        companyId: result.companyId
                    }
                    : null
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
