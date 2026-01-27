const FollowService = require('../../src/services/FollowService');
const { FollowRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('FollowService.getFollowedCompanies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';

    it('should return followed companies list', async () => {
        const mockFollowedCompanies = [
            { userId, companyId: 'comp-1', company: { name: 'Company 1' } },
            { userId, companyId: 'comp-2', company: { name: 'Company 2' } }
        ];
        FollowRepository.findByUser.mockResolvedValue(mockFollowedCompanies);

        const result = await FollowService.getFollowedCompanies(userId);

        expect(FollowRepository.findByUser).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockFollowedCompanies);
    });

    it('should return empty list if no companies followed', async () => {
        FollowRepository.findByUser.mockResolvedValue([]);

        const result = await FollowService.getFollowedCompanies(userId);

        expect(FollowRepository.findByUser).toHaveBeenCalledWith(userId);
        expect(result).toEqual([]);
    });
});
