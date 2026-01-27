const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ApplicationService.updateApplicationStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const applicationId = 1;

    it('should update status successfully', async () => {
        const mockApp = { applicationId, jobPost: { companyId: 99 } };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 99 });
        ApplicationRepository.updateStatus.mockResolvedValue([1]);

        await ApplicationService.updateApplicationStatus(userId, applicationId, 'Interview', 'Notes');

        expect(ApplicationRepository.findDetailById).toHaveBeenCalledWith(applicationId);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(ApplicationRepository.updateStatus).toHaveBeenCalledWith(applicationId, 'Interview', 'Notes');
    });

    it('should throw BAD_REQUEST if status invalid', async () => {
        await expect(ApplicationService.updateApplicationStatus(userId, applicationId, 'Invalid', 'Notes'))
            .rejects.toThrow(MESSAGES.INVALID_APPLICATION_STATUS);
    });

    it('should throw NOT_FOUND if application not found', async () => {
        ApplicationRepository.findDetailById.mockResolvedValue(null);

        await expect(ApplicationService.updateApplicationStatus(userId, applicationId, 'Interview', 'Notes'))
            .rejects.toThrow(MESSAGES.APPLICATION_NOT_FOUND);
    });

    it('should throw FORBIDDEN if user is not owner', async () => {
        const mockApp = { applicationId, jobPost: { companyId: 99 } };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 55 });

        await expect(ApplicationService.updateApplicationStatus(userId, applicationId, 'Interview', 'Notes'))
            .rejects.toThrow(MESSAGES.FORBIDDEN);
    });
});
