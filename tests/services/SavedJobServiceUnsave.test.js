const SavedJobService = require('../../src/services/SavedJobService');
const { SavedJobRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('SavedJobService.unsaveJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const jobPostId = 1;

    it('should unsave job successfully', async () => {
        SavedJobRepository.checkSaved.mockResolvedValue({ userId, jobPostId });
        SavedJobRepository.unsaveJob.mockResolvedValue(true);

        const result = await SavedJobService.unsaveJob(userId, jobPostId);

        expect(SavedJobRepository.checkSaved).toHaveBeenCalledWith(userId, jobPostId);
        expect(SavedJobRepository.unsaveJob).toHaveBeenCalledWith(userId, jobPostId);
        expect(result).toBe(true);
    });

    it('should throw NOT_FOUND if job not saved', async () => {
        SavedJobRepository.checkSaved.mockResolvedValue(null);

        await expect(SavedJobService.unsaveJob(userId, jobPostId)).rejects.toThrow(MESSAGES.SAVED_JOB_NOT_FOUND);
        expect(SavedJobRepository.checkSaved).toHaveBeenCalledWith(userId, jobPostId);
        expect(SavedJobRepository.unsaveJob).not.toHaveBeenCalled();
    });
});
