const jwtHelper = require('../utils/jwtHelper');
const { UserRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

/**
 * Middleware xác thực JWT token
 * Flow: Extract token -> Verify -> Get user -> Attach to req
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            const error = new Error(MESSAGES.TOKEN_REQUIRED);
            error.status = HTTP_STATUS.UNAUTHORIZED;
            throw error;
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : authHeader;

        if (!token) {
            const error = new Error(MESSAGES.TOKEN_REQUIRED);
            error.status = HTTP_STATUS.UNAUTHORIZED;
            throw error;
        }

        const decoded = jwtHelper.verifyAccessToken(token);

        const user = await UserRepository.findById(decoded.userId);

        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.UNAUTHORIZED;
            throw error;
        }

        req.user = {
            userId: user.userId,
            email: user.email,
            role: user.role,
            fullName: user.fullName
        };

        next();
    } catch (error) {
        if (error.status) {
            next(error);
        } else {
            const err = new Error(MESSAGES.INVALID_TOKEN);
            err.status = HTTP_STATUS.UNAUTHORIZED;
            next(err);
        }
    }
};

module.exports = { authenticateToken };
