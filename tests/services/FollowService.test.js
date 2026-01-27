const FollowService = require('../../src/services/FollowService');
const { FollowRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('FollowService.followCompany', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const companyId = 'company-456';

    it('should follow company successfully', async () => {
        const mockCompany = { companyId: 'company-456' };
        CompanyRepository.findById.mockResolvedValue(mockCompany);
        FollowRepository.checkFollowing.mockResolvedValue(null);
        FollowRepository.followCompany.mockResolvedValue({ userId, companyId });

        const result = await FollowService.followCompany(userId, companyId);

        expect(CompanyRepository.findById).toHaveBeenCalledWith(companyId);
        expect(FollowRepository.checkFollowing).toHaveBeenCalledWith(userId, companyId);
        expect(FollowRepository.followCompany).toHaveBeenCalledWith(userId, companyId);
        expect(result).toEqual({ userId, companyId });
    });

    it('should throw NOT_FOUND if company does not exist', async () => {
        CompanyRepository.findById.mockResolvedValue(null);

        await expect(FollowService.followCompany(userId, companyId)).rejects.toThrow(MESSAGES.COMPANY_NOT_FOUND);
        expect(FollowRepository.checkFollowing).not.toHaveBeenCalled();
        expect(FollowRepository.followCompany).not.toHaveBeenCalled();
    });

    it('should throw BAD_REQUEST if already following', async () => {
        const mockCompany = { companyId: 'company-456' };
        CompanyRepository.findById.mockResolvedValue(mockCompany);
        FollowRepository.checkFollowing.mockResolvedValue({ userId, companyId });

        await expect(FollowService.followCompany(userId, companyId)).rejects.toThrow(MESSAGES.ALREADY_FOLLOWED);
        expect(FollowRepository.followCompany).not.toHaveBeenCalled();
    });
});
