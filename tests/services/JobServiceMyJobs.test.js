const JobService = require('../../src/services/JobService');
const { JobPostRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('JobService.getMyJobs', () => {
    let mockCompany;

    beforeEach(() => {
        jest.clearAllMocks();

        mockCompany = {
            companyId: 1,
            userId: 1
        };
    });

    it('should return list of jobs for valid employer', async () => {
        const mockJobs = [{ jobPostId: 1, title: 'Job 1', status: 'Active' }];
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
        JobPostRepository.findByCompany.mockResolvedValue(mockJobs);

        const result = await JobService.getMyJobs(1, { status: 'Active' });

        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(1);
        expect(JobPostRepository.findByCompany).toHaveBeenCalledWith(1, { status: 'Active' });
        expect(result).toEqual(mockJobs);
    });

    it('should throw FORBIDDEN if user has no company', async () => {
        CompanyRepository.findByUserId.mockResolvedValue(null);

        await expect(JobService.getMyJobs(1, {})).rejects.toThrow('Bạn chưa đăng ký thông tin nhà tuyển dụng.');
        expect(JobPostRepository.findByCompany).not.toHaveBeenCalled();
    });
});
