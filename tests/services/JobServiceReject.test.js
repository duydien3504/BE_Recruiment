const JobService = require('../../src/services/JobService');
const { JobPostRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('JobService.rejectJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should reject pending job successfully with reason', async () => {
        const mockJob = { jobPostId: 1, status: 'Pending' };
        JobPostRepository.findById.mockResolvedValue(mockJob);
        JobPostRepository.updateStatus.mockResolvedValue({ ...mockJob, status: 'Rejected' });

        const result = await JobService.rejectJob(1, 'Reason');

        expect(JobPostRepository.findById).toHaveBeenCalledWith(1);
        expect(JobPostRepository.updateStatus).toHaveBeenCalledWith(1, 'Rejected', 'Reason');
        expect(result.status).toBe('Rejected');
    });

    it('should throw BAD_REQUEST if job is not pending', async () => {
        const mockJob = { jobPostId: 1, status: 'Active' };
        JobPostRepository.findById.mockResolvedValue(mockJob);

        await expect(JobService.rejectJob(1, 'Reason')).rejects.toThrow('Chỉ có thể từ chối tin đang ở trạng thái chờ duyệt (Pending).');
        expect(JobPostRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should throw NOT_FOUND if job does not exist', async () => {
        JobPostRepository.findById.mockResolvedValue(null);

        await expect(JobService.rejectJob(1, 'Reason')).rejects.toThrow(MESSAGES.JOB_NOT_FOUND);
    });
});
