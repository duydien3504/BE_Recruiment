const FollowService = require('../../src/services/FollowService');
const { FollowRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('FollowService.unfollowCompany', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const companyId = 'company-456';

    it('should unfollow company successfully', async () => {
        FollowRepository.checkFollowing.mockResolvedValue({ userId, companyId });
        FollowRepository.unfollowCompany.mockResolvedValue(true);

        const result = await FollowService.unfollowCompany(userId, companyId);

        expect(FollowRepository.checkFollowing).toHaveBeenCalledWith(userId, companyId);
        expect(FollowRepository.unfollowCompany).toHaveBeenCalledWith(userId, companyId);
        expect(result).toBe(true);
    });

    it('should throw NOT_FOUND if not following', async () => {
        FollowRepository.checkFollowing.mockResolvedValue(null);

        await expect(FollowService.unfollowCompany(userId, companyId)).rejects.toThrow(MESSAGES.NOT_FOLLOWING);
        expect(FollowRepository.checkFollowing).toHaveBeenCalledWith(userId, companyId);
        expect(FollowRepository.unfollowCompany).not.toHaveBeenCalled();
    });
});
