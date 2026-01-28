const InterviewService = require('../../src/services/InterviewService');
const { InterviewRepository, CompanyRepository } = require('../../src/repositories');
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

describe('InterviewService.getEmployerInterviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const companyId = 100;

    it('should return upcoming interviews for company', async () => {
        const mockInterviews = [{ id: 1 }, { id: 2 }];
        CompanyRepository.findByUserId.mockResolvedValue({ companyId });
        InterviewRepository.findUpcomingByCompany.mockResolvedValue(mockInterviews);

        const result = await InterviewService.getEmployerInterviews(userId);

        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(InterviewRepository.findUpcomingByCompany).toHaveBeenCalledWith(companyId);
        expect(result).toEqual(mockInterviews);
    });

    it('should return empty list if user has no company', async () => {
        CompanyRepository.findByUserId.mockResolvedValue(null);

        const result = await InterviewService.getEmployerInterviews(userId);

        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(InterviewRepository.findUpcomingByCompany).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('should return empty list if no interviews found', async () => {
        CompanyRepository.findByUserId.mockResolvedValue({ companyId });
        InterviewRepository.findUpcomingByCompany.mockResolvedValue([]);

        const result = await InterviewService.getEmployerInterviews(userId);

        expect(result).toEqual([]);
    });
});
