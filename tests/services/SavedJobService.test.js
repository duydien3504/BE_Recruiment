const SavedJobService = require('../../src/services/SavedJobService');
const { SavedJobRepository, JobPostRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('SavedJobService.saveJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const jobPostId = 1;

    it('should save job successfully', async () => {
        const mockJob = { jobPostId: 1 };
        JobPostRepository.findById.mockResolvedValue(mockJob);
        SavedJobRepository.checkSaved.mockResolvedValue(null);
        SavedJobRepository.saveJob.mockResolvedValue({ userId, jobPostId });

        const result = await SavedJobService.saveJob(userId, jobPostId);

        expect(JobPostRepository.findById).toHaveBeenCalledWith(jobPostId);
        expect(SavedJobRepository.checkSaved).toHaveBeenCalledWith(userId, jobPostId);
        expect(SavedJobRepository.saveJob).toHaveBeenCalledWith(userId, jobPostId);
        expect(result).toEqual({ userId, jobPostId });
    });

    it('should throw NOT_FOUND if job does not exist', async () => {
        JobPostRepository.findById.mockResolvedValue(null);

        await expect(SavedJobService.saveJob(userId, jobPostId)).rejects.toThrow(MESSAGES.JOB_NOT_FOUND);
        expect(SavedJobRepository.checkSaved).not.toHaveBeenCalled();
        expect(SavedJobRepository.saveJob).not.toHaveBeenCalled();
    });

    it('should throw BAD_REQUEST if job already saved', async () => {
        const mockJob = { jobPostId: 1 };
        JobPostRepository.findById.mockResolvedValue(mockJob);
        SavedJobRepository.checkSaved.mockResolvedValue({ userId, jobPostId });

        await expect(SavedJobService.saveJob(userId, jobPostId)).rejects.toThrow(MESSAGES.JOB_ALREADY_SAVED);
        expect(SavedJobRepository.saveJob).not.toHaveBeenCalled();
    });
});
