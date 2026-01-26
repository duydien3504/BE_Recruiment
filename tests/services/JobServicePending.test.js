const JobService = require('../../src/services/JobService');
const { JobPostRepository } = require('../../src/repositories');

jest.mock('../../src/repositories');

describe('JobService.getPendingJobs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return pending jobs sorted by created_at ASC', async () => {
        const mockJobs = [{ jobPostId: 1, status: 'Pending' }];
        JobPostRepository.findByStatus.mockResolvedValue(mockJobs);

        const result = await JobService.getPendingJobs({});

        expect(JobPostRepository.findByStatus).toHaveBeenCalledWith('Pending', {
            order: [['created_at', 'ASC']]
        });
        expect(result).toEqual(mockJobs);
    });
});
