const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ApplicationService.getEmployerApplicationDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const applicationId = 1;

    it('should return application detail and update status to Viewed if Pending', async () => {
        const mockApp = { applicationId, jobPost: { companyId: 99 }, status: 'Pending' };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 99 });
        ApplicationRepository.updateStatus.mockResolvedValue([1]);

        const result = await ApplicationService.getEmployerApplicationDetail(userId, applicationId);

        expect(ApplicationRepository.findDetailById).toHaveBeenCalledWith(applicationId);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(ApplicationRepository.updateStatus).toHaveBeenCalledWith(applicationId, 'Viewed');
        expect(result.status).toBe('Viewed');
    });

    it('should throw NOT_FOUND if application not found', async () => {
        ApplicationRepository.findDetailById.mockResolvedValue(null);

        await expect(ApplicationService.getEmployerApplicationDetail(userId, applicationId)).rejects.toThrow(MESSAGES.APPLICATION_NOT_FOUND);
    });

    it('should throw FORBIDDEN if company is not owner', async () => {
        const mockApp = { applicationId, jobPost: { companyId: 99 }, status: 'Pending' };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 55 });

        await expect(ApplicationService.getEmployerApplicationDetail(userId, applicationId)).rejects.toThrow(MESSAGES.FORBIDDEN);
    });
});
