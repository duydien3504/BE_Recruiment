const JobService = require('../../src/services/JobService');
const { JobPostRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('JobService.approveJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should approve pending job successfully', async () => {
        const mockJob = { jobPostId: 1, status: 'Pending' };
        JobPostRepository.findById.mockResolvedValue(mockJob);
        JobPostRepository.updateStatus.mockResolvedValue({ ...mockJob, status: 'Active' });

        const result = await JobService.approveJob(1);

        expect(JobPostRepository.findById).toHaveBeenCalledWith(1);
        expect(JobPostRepository.updateStatus).toHaveBeenCalledWith(1, 'Active');
        expect(result.status).toBe('Active');
    });

    it('should throw BAD_REQUEST if job is not pending', async () => {
        const mockJob = { jobPostId: 1, status: 'Draft' };
        JobPostRepository.findById.mockResolvedValue(mockJob);

        await expect(JobService.approveJob(1)).rejects.toThrow('Chỉ có thể duyệt tin đang ở trạng thái chờ duyệt (Pending).');
        expect(JobPostRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should throw NOT_FOUND if job does not exist', async () => {
        JobPostRepository.findById.mockResolvedValue(null);

        await expect(JobService.approveJob(1)).rejects.toThrow(MESSAGES.JOB_NOT_FOUND);
    });
});
