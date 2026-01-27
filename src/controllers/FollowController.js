const FollowService = require('../services/FollowService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');

class FollowController {
    /**
     * Follow company
     * @route POST /api/v1/follows
     */
    async followCompany(req, res, next) {
        try {
            const userId = req.user.userId;
            const { companyId } = req.body;

            if (!companyId) {
                const error = new Error('Company ID là bắt buộc.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            await FollowService.followCompany(userId, companyId);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.FOLLOW_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get followed companies
     * @route GET /api/v1/follows
     */
    async getFollowedCompanies(req, res, next) {
        try {
            const userId = req.user.userId;
            const companies = await FollowService.getFollowedCompanies(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_FOLLOWED_COMPANIES_SUCCESS,
                data: companies
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Unfollow company
     * @route DELETE /api/v1/follows/:companyId
     */
    async unfollowCompany(req, res, next) {
        try {
            const userId = req.user.userId;
            const { companyId } = req.params;

            if (!companyId) {
                const error = new Error('Company ID là bắt buộc.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            await FollowService.unfollowCompany(userId, companyId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UNFOLLOW_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FollowController();
