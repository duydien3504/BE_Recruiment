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

describe('InterviewService.updateInterview', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const interviewId = 10;
    const applicationId = 1;
    const updateData = { interview_time: '2024-02-05T10:00:00Z', note: 'Rescheduled' };

    it('should update interview successfully', async () => {
        const mockInterview = { interviewId, applicationId };
        const mockApp = { applicationId, jobPost: { companyId: 99 } };

        InterviewRepository.findById.mockResolvedValue(mockInterview);
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 99 });
        InterviewRepository.update.mockResolvedValue([1]);

        await InterviewService.updateInterview(userId, interviewId, updateData);

        expect(InterviewRepository.findById).toHaveBeenCalledWith(interviewId);
        expect(ApplicationRepository.findDetailById).toHaveBeenCalledWith(applicationId);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(InterviewRepository.update).toHaveBeenCalledWith(interviewId, {
            interviewTime: updateData.interview_time,
            note: updateData.note
        });
    });

    it('should throw NOT_FOUND if interview not found', async () => {
        InterviewRepository.findById.mockResolvedValue(null);

        await expect(InterviewService.updateInterview(userId, interviewId, updateData))
            .rejects.toThrow(MESSAGES.INTERVIEW_NOT_FOUND);
    });

    it('should throw FORBIDDEN if user is not owner', async () => {
        const mockInterview = { interviewId, applicationId };
        const mockApp = { applicationId, jobPost: { companyId: 99 } };

        InterviewRepository.findById.mockResolvedValue(mockInterview);
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 55 }); // Different company

        await expect(InterviewService.updateInterview(userId, interviewId, updateData))
            .rejects.toThrow(MESSAGES.FORBIDDEN);
    });
});
