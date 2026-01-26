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

        const user = await UserRepository.findById(decoded.userId, {
            include: [{
                model: require('../models').Role,
                as: 'role',
                attributes: ['roleName']
            }]
        });

        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.UNAUTHORIZED;
            throw error;
        }

        req.user = {
            userId: user.userId,
            email: user.email,
            role: user.role ? user.role.roleName : null,
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

const optionalAuthenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return next();

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : authHeader;

        if (!token) return next();

        const decoded = jwtHelper.verifyAccessToken(token);
        const user = await UserRepository.findById(decoded.userId, {
            include: [{
                model: require('../models').Role,
                as: 'role',
                attributes: ['roleName']
            }]
        });

        if (user) {
            req.user = {
                userId: user.userId,
                email: user.email,
                role: user.role ? user.role.roleName : null,
                fullName: user.fullName
            };
        }
        next();
    } catch (error) {
        // Ignore headers errors, treat as guest
        next();
    }
};

/**
 * Middleware phân quyền
 * @param {Array<string>} roles - Danh sách roles cho phép
 */
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            const error = new Error(MESSAGES.UNAUTHORIZED);
            error.status = HTTP_STATUS.UNAUTHORIZED;
            return next(error);
        }

        // roles có thể là string (1 role) hoặc array
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        // req.user.role có thể là string (e.g. 'Admin') hoặc object { name: 'Admin' } tùy implementation
        // Ở authenticateToken đang gán req.user.role = user.role.
        // Giả sử user.role là string name của role hoặc object Role
        // Cần check kỹ implementation của RoleModel
        // Tuy nhiên log error cho thấy req.user.role lấy từ user.role

        // Tạm cover case user.role là String
        // req.user.role lúc này đã là string RoleName (do authenticateToken map rồi)
        const userRole = req.user.role;

        if (!userRole) {
            const error = new Error('Bạn không có quyền thực hiện hành động này.');
            error.status = HTTP_STATUS.FORBIDDEN;
            return next(error);
        }

        // So sánh không phân biệt hoa thường (Admin vs ADMIN)
        const hasPermission = allowedRoles.some(role => role.toUpperCase() === userRole.toUpperCase());

        if (!hasPermission) {
            const error = new Error('Bạn không có quyền thực hiện hành động này.');
            error.status = HTTP_STATUS.FORBIDDEN;
            return next(error);
        }

        next();
    };
};

module.exports = { authenticateToken, optionalAuthenticateToken, authorize };
