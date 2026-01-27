const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository, JobPostRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ApplicationService.getJobApplications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const jobId = 1;
    const companyId = 100;

    it('should return applications list for valid employer and job', async () => {
        JobPostRepository.findById.mockResolvedValue({ jobPostId: jobId, companyId });
        CompanyRepository.findByUserId.mockResolvedValue({ companyId, userId });
        const mockApps = [{ applicationId: 1, user: { fullName: 'A' } }];
        ApplicationRepository.findByJobPost.mockResolvedValue(mockApps);

        const result = await ApplicationService.getJobApplications(userId, jobId);

        expect(JobPostRepository.findById).toHaveBeenCalledWith(jobId);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(ApplicationRepository.findByJobPost).toHaveBeenCalledWith(jobId);
        expect(result).toEqual(mockApps);
    });

    it('should throw NOT_FOUND if job not found', async () => {
        JobPostRepository.findById.mockResolvedValue(null);

        await expect(ApplicationService.getJobApplications(userId, jobId)).rejects.toThrow(MESSAGES.JOB_NOT_FOUND);
    });

    it('should throw FORBIDDEN if user has no company', async () => {
        JobPostRepository.findById.mockResolvedValue({ jobPostId: jobId, companyId });
        CompanyRepository.findByUserId.mockResolvedValue(null);

        await expect(ApplicationService.getJobApplications(userId, jobId)).rejects.toThrow(MESSAGES.FORBIDDEN);
    });

    it('should throw FORBIDDEN if user company does not own job', async () => {
        JobPostRepository.findById.mockResolvedValue({ jobPostId: jobId, companyId: 999 });
        CompanyRepository.findByUserId.mockResolvedValue({ companyId, userId });

        await expect(ApplicationService.getJobApplications(userId, jobId)).rejects.toThrow(MESSAGES.FORBIDDEN);
    });
});
