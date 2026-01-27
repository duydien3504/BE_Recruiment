const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ApplicationService.getCandidateApplications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';

    it('should return application history', async () => {
        const mockApplications = [
            { userId, jobPost: { title: 'Job 1' } },
            { userId, jobPost: { title: 'Job 2' } }
        ];
        ApplicationRepository.findByUser.mockResolvedValue(mockApplications);

        const result = await ApplicationService.getCandidateApplications(userId);

        expect(ApplicationRepository.findByUser).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockApplications);
    });

    it('should return empty list if no applications found', async () => {
        ApplicationRepository.findByUser.mockResolvedValue([]);

        const result = await ApplicationService.getCandidateApplications(userId);

        expect(ApplicationRepository.findByUser).toHaveBeenCalledWith(userId);
        expect(result).toEqual([]);
    });
});
