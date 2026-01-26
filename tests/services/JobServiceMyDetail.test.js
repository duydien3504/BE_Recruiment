const JobService = require('../../src/services/JobService');
const { JobPostRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('JobService.getMyJobDetail', () => {
    let mockCompany;
    let mockJob;

    beforeEach(() => {
        jest.clearAllMocks();

        mockCompany = {
            companyId: 1,
            userId: 1
        };

        mockJob = {
            jobPostId: 1,
            companyId: 1,
            title: 'Job 1'
        };
    });

    it('should return job detail when owner requests', async () => {
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
        JobPostRepository.getDetail.mockResolvedValue(mockJob);

        const result = await JobService.getMyJobDetail(1, 1);

        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(1);
        expect(JobPostRepository.getDetail).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockJob);
    });

    it('should throw FORBIDDEN if user is not owner', async () => {
        const otherJob = { ...mockJob, companyId: 2 };
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
        JobPostRepository.getDetail.mockResolvedValue(otherJob);

        await expect(JobService.getMyJobDetail(1, 1)).rejects.toThrow('Bạn không có quyền xem tin này.');
    });

    it('should throw NOT_FOUND if job does not exist', async () => {
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
        JobPostRepository.getDetail.mockResolvedValue(null);

        await expect(JobService.getMyJobDetail(1, 1)).rejects.toThrow(MESSAGES.JOB_NOT_FOUND);
    });
});
