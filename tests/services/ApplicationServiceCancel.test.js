const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ApplicationService.cancelApplication', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-uuid-123';
    const applicationId = 10;

    // ─── Happy Path ──────────────────────────────────────────────────────────────
    it('should delete the application successfully when it is Pending and belongs to user', async () => {
        const mockPendingApp = { applicationId, userId, status: 'Pending' };
        ApplicationRepository.findPendingByIdAndUserId.mockResolvedValue(mockPendingApp);
        ApplicationRepository.deleteById.mockResolvedValue(true);

        await ApplicationService.cancelApplication(applicationId, userId);

        expect(ApplicationRepository.findPendingByIdAndUserId).toHaveBeenCalledWith(applicationId, userId);
        expect(ApplicationRepository.deleteById).toHaveBeenCalledWith(applicationId);
    });

    // ─── Error Cases ─────────────────────────────────────────────────────────────
    it('should throw 404 NOT_FOUND when application does not exist or does not belong to user', async () => {
        ApplicationRepository.findPendingByIdAndUserId.mockResolvedValue(null);
        ApplicationRepository.findOne.mockResolvedValue(null);

        await expect(ApplicationService.cancelApplication(applicationId, userId))
            .rejects.toMatchObject({
                message: MESSAGES.APPLICATION_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            });

        expect(ApplicationRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should throw 400 BAD_REQUEST when application exists but status is not Pending (Viewed)', async () => {
        ApplicationRepository.findPendingByIdAndUserId.mockResolvedValue(null);
        ApplicationRepository.findOne.mockResolvedValue({ applicationId, status: 'Viewed' });

        await expect(ApplicationService.cancelApplication(applicationId, userId))
            .rejects.toMatchObject({
                message: MESSAGES.APPLICATION_CANNOT_BE_CANCELLED,
                status: HTTP_STATUS.BAD_REQUEST
            });

        expect(ApplicationRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should throw 400 BAD_REQUEST when status is Interview', async () => {
        ApplicationRepository.findPendingByIdAndUserId.mockResolvedValue(null);
        ApplicationRepository.findOne.mockResolvedValue({ applicationId, status: 'Interview' });

        await expect(ApplicationService.cancelApplication(applicationId, userId))
            .rejects.toMatchObject({
                message: MESSAGES.APPLICATION_CANNOT_BE_CANCELLED,
                status: HTTP_STATUS.BAD_REQUEST
            });
    });

    it('should throw 400 BAD_REQUEST when status is Accepted', async () => {
        ApplicationRepository.findPendingByIdAndUserId.mockResolvedValue(null);
        ApplicationRepository.findOne.mockResolvedValue({ applicationId, status: 'Accepted' });

        await expect(ApplicationService.cancelApplication(applicationId, userId))
            .rejects.toMatchObject({
                message: MESSAGES.APPLICATION_CANNOT_BE_CANCELLED,
                status: HTTP_STATUS.BAD_REQUEST
            });
    });

    it('should throw 400 BAD_REQUEST when status is Rejected', async () => {
        ApplicationRepository.findPendingByIdAndUserId.mockResolvedValue(null);
        ApplicationRepository.findOne.mockResolvedValue({ applicationId, status: 'Rejected' });

        await expect(ApplicationService.cancelApplication(applicationId, userId))
            .rejects.toMatchObject({
                message: MESSAGES.APPLICATION_CANNOT_BE_CANCELLED,
                status: HTTP_STATUS.BAD_REQUEST
            });
    });
});
