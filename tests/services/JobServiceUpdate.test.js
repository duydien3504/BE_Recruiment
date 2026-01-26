const JobService = require('../../src/services/JobService');
const { JobPostRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('JobService.updateJob', () => {
    let mockJob;
    let mockCompany;

    beforeEach(() => {
        jest.clearAllMocks();

        mockJob = {
            jobPostId: 1,
            companyId: 1,
            title: 'Old Title',
            update: jest.fn().mockResolvedValue(true)
        };

        mockCompany = {
            companyId: 1,
            userId: 1
        };
    });

    it('should update job successfully when user is owner', async () => {
        JobPostRepository.findById.mockResolvedValue(mockJob);
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
        JobPostRepository.update.mockResolvedValue({ ...mockJob, title: 'New Title' });

        const updateData = { title: 'New Title' };
        const result = await JobService.updateJob(1, 1, updateData);

        expect(JobPostRepository.findById).toHaveBeenCalledWith(1);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(1);
        expect(JobPostRepository.update).toHaveBeenCalledWith(1, { title: 'New Title' });
        expect(result).toEqual(expect.objectContaining({ title: 'New Title' }));
    });

    it('should throw NOT_FOUND error if job does not exist', async () => {
        JobPostRepository.findById.mockResolvedValue(null);

        await expect(JobService.updateJob(1, 999, {})).rejects.toThrow(MESSAGES.JOB_NOT_FOUND);
        expect(CompanyRepository.findByUserId).not.toHaveBeenCalled();
    });

    it('should throw FORBIDDEN error if user is not owner', async () => {
        JobPostRepository.findById.mockResolvedValue(mockJob);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 2, userId: 1 }); // Different companyId

        await expect(JobService.updateJob(1, 1, {})).rejects.toThrow('Bạn không có quyền chỉnh sửa tin này.');
    });

    it('should throw FORBIDDEN error if user does not have company', async () => {
        JobPostRepository.findById.mockResolvedValue(mockJob);
        CompanyRepository.findByUserId.mockResolvedValue(null);

        await expect(JobService.updateJob(1, 1, {})).rejects.toThrow('Bạn không có quyền chỉnh sửa tin này.');
    });
});
