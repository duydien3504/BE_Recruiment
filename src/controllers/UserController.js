const UserService = require('../services/UserService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class UserController {
    /**
     * Lấy thông tin profile của user đang đăng nhập
     * @route GET /api/v1/users/profile
     */
    async getProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const profile = await UserService.getProfile(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_PROFILE_SUCCESS,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật thông tin profile của user đang đăng nhập
     * @route PUT /api/v1/users/profile
     */
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const updatedProfile = await UserService.updateProfile(userId, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_PROFILE_SUCCESS,
                data: updatedProfile
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đổi mật khẩu của user đang đăng nhập
     * @route PATCH /api/v1/users/change-password
     */
    async changePassword(req, res, next) {
        try {
            const userId = req.user.userId;
            await UserService.changePassword(userId, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.CHANGE_PASSWORD_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Upload avatar của user đang đăng nhập
     * @route POST /api/v1/users/avatar
     */
    async uploadAvatar(req, res, next) {
        try {
            if (!req.file) {
                const error = new Error(MESSAGES.FILE_REQUIRED);
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            const userId = req.user.userId;
            const result = await UserService.uploadAvatar(userId, req.file.buffer);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPLOAD_AVATAR_SUCCESS,
                data: {
                    avatarUrl: result.avatarUrl
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách kỹ năng của user đang đăng nhập
     * @route GET /api/v1/users/skills
     */
    async getMySkills(req, res, next) {
        try {
            const userId = req.user.userId;
            const skills = await UserService.getMySkills(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_MY_SKILLS_SUCCESS,
                data: skills
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Thêm kỹ năng cho user đang đăng nhập
     * @route POST /api/v1/users/skills
     */
    async addSkills(req, res, next) {
        try {
            const userId = req.user.userId;
            const { skillIds } = req.body;
            await UserService.addSkills(userId, skillIds);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.ADD_SKILLS_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xóa kỹ năng khỏi hồ sơ user đang đăng nhập
     * @route DELETE /api/v1/users/skills/:skillId
     */
    async removeSkill(req, res, next) {
        try {
            const userId = req.user.userId;
            const { skillId } = req.params;
            await UserService.removeSkill(userId, skillId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.DELETE_SKILL_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đăng ký nâng cấp lên Employer
     * @route POST /api/v1/users/upgrade-employer
     */
    async upgradeToEmployer(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await UserService.upgradeToEmployer(userId, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách users (Admin)
     * @route GET /api/v1/admin/users
     */
    async getAllUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers(req.query);
            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_USERS_SUCCESS,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy chi tiết user (Admin)
     * @route GET /api/v1/admin/users/:id
     */
    async getUserDetail(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserDetailForAdmin(id);
            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_PROFILE_SUCCESS, // Reusing existing message or create new
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user status (Admin)
     * @route PATCH /api/v1/admin/users/:id/status
     */
    async updateUserStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await UserService.updateUserStatus(id, status);
            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_USER_STATUS_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
