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
}

module.exports = new AuthController();
