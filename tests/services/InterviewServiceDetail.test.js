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

describe('InterviewService.getInterviewDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const interviewId = 10;
    const applicationId = 1;

    it('should return interview detail for Candidate', async () => {
        const mockInterview = { interviewId, applicationId };
        // Structure based on findDetailById include
        const mockApp = {
            applicationId,
            user: { userId: 'user-123' },
            jobPost: { companyId: 100 }
        };

        InterviewRepository.findById.mockResolvedValue(mockInterview);
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);

        const result = await InterviewService.getInterviewDetail(userId, interviewId);

        expect(InterviewRepository.findById).toHaveBeenCalledWith(interviewId);
        expect(ApplicationRepository.findDetailById).toHaveBeenCalledWith(applicationId);
        expect(result).toEqual(mockInterview);
    });

    it('should return interview detail for Employer', async () => {
        const mockInterview = { interviewId, applicationId };
        const mockApp = {
            applicationId,
            user: { userId: 'candidate-99' },
            jobPost: { companyId: 100 }
        };

        InterviewRepository.findById.mockResolvedValue(mockInterview);
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 100 });

        const result = await InterviewService.getInterviewDetail(userId, interviewId);

        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockInterview);
    });

    it('should throw NOT_FOUND if interview not found', async () => {
        InterviewRepository.findById.mockResolvedValue(null);

        await expect(InterviewService.getInterviewDetail(userId, interviewId))
            .rejects.toThrow(MESSAGES.INTERVIEW_NOT_FOUND);
    });

    it('should throw FORBIDDEN if user is neither candidate nor employer', async () => {
        const mockInterview = { interviewId, applicationId };
        const mockApp = {
            applicationId,
            user: { userId: 'candidate-99' },
            jobPost: { companyId: 100 }
        };

        InterviewRepository.findById.mockResolvedValue(mockInterview);
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 200 }); // Different company

        await expect(InterviewService.getInterviewDetail(userId, interviewId))
            .rejects.toThrow(MESSAGES.FORBIDDEN);
    });
});
