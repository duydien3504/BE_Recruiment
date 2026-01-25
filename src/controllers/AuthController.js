const AuthService = require('../services/AuthService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

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
}

module.exports = new AuthController();
