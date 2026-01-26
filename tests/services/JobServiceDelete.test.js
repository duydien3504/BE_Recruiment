const JobService = require('../../src/services/JobService');
const { JobPostRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('JobService.deleteJob', () => {
    let mockJob;
    let mockCompany;

    beforeEach(() => {
        jest.clearAllMocks();

        mockJob = {
            jobPostId: 1,
            companyId: 1
        };

        mockCompany = {
            companyId: 1,
            userId: 1
        };
    });

    it('should delete job successfully when user is owner', async () => {
        JobPostRepository.findById.mockResolvedValue(mockJob);
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
        JobPostRepository.softDelete.mockResolvedValue(true);

        const result = await JobService.deleteJob(1, 1);

        expect(JobPostRepository.findById).toHaveBeenCalledWith(1);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(1);
        expect(JobPostRepository.softDelete).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });

    it('should throw NOT_FOUND error if job does not exist', async () => {
        JobPostRepository.findById.mockResolvedValue(null);

        await expect(JobService.deleteJob(1, 999)).rejects.toThrow(MESSAGES.JOB_NOT_FOUND);
        expect(CompanyRepository.findByUserId).not.toHaveBeenCalled();
        expect(JobPostRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw FORBIDDEN error if user is not owner', async () => {
        JobPostRepository.findById.mockResolvedValue(mockJob);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 2, userId: 1 }); // Different companyId

        await expect(JobService.deleteJob(1, 1)).rejects.toThrow('Bạn không có quyền xóa tin này.');
        expect(JobPostRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw FORBIDDEN error if user does not have company', async () => {
        JobPostRepository.findById.mockResolvedValue(mockJob);
        CompanyRepository.findByUserId.mockResolvedValue(null);

        await expect(JobService.deleteJob(1, 1)).rejects.toThrow('Bạn không có quyền xóa tin này.');
        expect(JobPostRepository.softDelete).not.toHaveBeenCalled();
    });
});
