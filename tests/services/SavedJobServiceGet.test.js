const SavedJobService = require('../../src/services/SavedJobService');
const { SavedJobRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('SavedJobService.getSavedJobs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';

    it('should return saved jobs list', async () => {
        const mockSavedJobs = [
            { userId, jobPostId: 1, jobPost: { title: 'Job 1' } },
            { userId, jobPostId: 2, jobPost: { title: 'Job 2' } }
        ];
        SavedJobRepository.findByUser.mockResolvedValue(mockSavedJobs);

        const result = await SavedJobService.getSavedJobs(userId);

        expect(SavedJobRepository.findByUser).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockSavedJobs);
    });

    it('should return empty list if no jobs saved', async () => {
        SavedJobRepository.findByUser.mockResolvedValue([]);

        const result = await SavedJobService.getSavedJobs(userId);

        expect(SavedJobRepository.findByUser).toHaveBeenCalledWith(userId);
        expect(result).toEqual([]);
    });
});
