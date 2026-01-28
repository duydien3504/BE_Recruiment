const InterviewService = require('../../src/services/InterviewService');
const { InterviewRepository } = require('../../src/repositories');
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

describe('InterviewService.getCandidateInterviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';

    it('should return upcoming interviews for candidate', async () => {
        const mockInterviews = [{ id: 1 }, { id: 2 }];
        InterviewRepository.findUpcomingByUser.mockResolvedValue(mockInterviews);

        const result = await InterviewService.getCandidateInterviews(userId);

        expect(InterviewRepository.findUpcomingByUser).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockInterviews);
    });

    it('should return empty list if no interviews found', async () => {
        InterviewRepository.findUpcomingByUser.mockResolvedValue([]);

        const result = await InterviewService.getCandidateInterviews(userId);

        expect(InterviewRepository.findUpcomingByUser).toHaveBeenCalledWith(userId);
        expect(result).toEqual([]);
    });
});
