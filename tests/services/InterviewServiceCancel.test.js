const InterviewService = require('../../src/services/InterviewService');
const { InterviewRepository, ApplicationRepository, CompanyRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');
jest.mock('../../src/config/database', () => ({
    sequelize: {
        transaction: jest.fn(),
        define: jest.fn().mockReturnValue({
            belongsTo: jest.fn(),
            hasMany: jest.fn(),
            belongsToMany: jest.fn(),
            hasOne: jest.fn()
        })
    }
}));
const { sequelize } = require('../../src/config/database');

describe('InterviewService.cancelInterview', () => {
    let mockTransaction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };
        sequelize.transaction.mockResolvedValue(mockTransaction);
    });

    const userId = 'user-123';
    const interviewId = 10;
    const applicationId = 1;

    it('should cancel interview successfully', async () => {
        const mockInterview = { interviewId, applicationId };
        const mockApp = { applicationId, jobPost: { companyId: 99 } };

        InterviewRepository.findById.mockResolvedValue(mockInterview);
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 99 });
        InterviewRepository.update.mockResolvedValue([1]);

        await InterviewService.cancelInterview(userId, interviewId);

        expect(InterviewRepository.findById).toHaveBeenCalledWith(interviewId);
        expect(ApplicationRepository.findDetailById).toHaveBeenCalledWith(applicationId);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(InterviewRepository.update).toHaveBeenCalledWith(interviewId, {
            isDeleted: true,
            status: 'Cancelled'
        }, { transaction: mockTransaction });
        expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw NOT_FOUND if interview not found', async () => {
        InterviewRepository.findById.mockResolvedValue(null);

        await expect(InterviewService.cancelInterview(userId, interviewId))
            .rejects.toThrow(MESSAGES.INTERVIEW_NOT_FOUND);
    });

    it('should throw FORBIDDEN if user is not owner', async () => {
        const mockInterview = { interviewId, applicationId };
        const mockApp = { applicationId, jobPost: { companyId: 99 } };

        InterviewRepository.findById.mockResolvedValue(mockInterview);
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 55 });

        await expect(InterviewService.cancelInterview(userId, interviewId))
            .rejects.toThrow(MESSAGES.FORBIDDEN);
    });
});
