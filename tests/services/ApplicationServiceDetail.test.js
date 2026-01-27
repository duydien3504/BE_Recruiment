const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ApplicationService.getApplicationDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const applicationId = 1;

    it('should return application detail if user owns it', async () => {
        const mockApplication = { applicationId, userId, status: 'Pending' };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApplication);

        const result = await ApplicationService.getApplicationDetail(userId, applicationId);

        expect(ApplicationRepository.findDetailById).toHaveBeenCalledWith(applicationId);
        expect(result).toEqual(mockApplication);
    });

    it('should throw NOT_FOUND if application not found', async () => {
        ApplicationRepository.findDetailById.mockResolvedValue(null);

        await expect(ApplicationService.getApplicationDetail(userId, applicationId)).rejects.toThrow(MESSAGES.APPLICATION_NOT_FOUND);
    });

    it('should throw FORBIDDEN if application does not belong to user', async () => {
        const mockApplication = { applicationId, userId: 'other-user', status: 'Pending' };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApplication);

        await expect(ApplicationService.getApplicationDetail(userId, applicationId)).rejects.toThrow(MESSAGES.FORBIDDEN);
    });
});
