const { FollowRepository, CompanyRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class FollowService {
    /**
     * Follow company
     * @param {string} userId
     * @param {string} companyId
     */
    async followCompany(userId, companyId) {
        // 1. Check if company exists
        const company = await CompanyRepository.findById(companyId);
        if (!company) {
            const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Check if already following
        const existing = await FollowRepository.checkFollowing(userId, companyId);
        if (existing) {
            const error = new Error(MESSAGES.ALREADY_FOLLOWED);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // 3. Follow
        return await FollowRepository.followCompany(userId, companyId);
    }

    /**
     * Get followed companies
     * @param {string} userId
     */
    async getFollowedCompanies(userId) {
        return await FollowRepository.findByUser(userId);
    }

    /**
     * Unfollow company
     * @param {string} userId
     * @param {string} companyId
     */
    async unfollowCompany(userId, companyId) {
        // 1. Check if following
        const existing = await FollowRepository.checkFollowing(userId, companyId);
        if (!existing) {
            const error = new Error(MESSAGES.NOT_FOLLOWING);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Unfollow
        return await FollowRepository.unfollowCompany(userId, companyId);
    }
}

module.exports = new FollowService();
