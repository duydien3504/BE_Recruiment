const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository, JobPostRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');
const axios = require('axios');

jest.mock('../../src/repositories');
jest.mock('axios');

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

describe('ApplicationService.getEmployerApplications', () => {
    const userId = 'user-123';
    const companyId = 100;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return paginated applications with filters', async () => {
        CompanyRepository.findByUserId.mockResolvedValue({ companyId, userId });
        JobPostRepository.findById.mockResolvedValue({ jobPostId: 1, companyId });
        ApplicationRepository.findAndCountForEmployerApplications.mockResolvedValue({
            count: 1,
            rows: [
                {
                    applicationId: 10,
                    status: 'Pending',
                    createdAt: '2026-03-15T12:00:00.000Z',
                    user: {
                        fullName: 'Nguyen Van A',
                        experienceYears: 3,
                        skills: [{ name: 'NodeJS' }, { name: 'Java' }]
                    }
                }
            ]
        });

        const result = await ApplicationService.getEmployerApplications(userId, {
            jobPostId: 1,
            skillIds: [1, 2],
            minExperience: 2,
            page: 1,
            limit: 10
        });

        expect(ApplicationRepository.findAndCountForEmployerApplications).toHaveBeenCalledWith(companyId, {
            jobPostId: 1,
            skillIds: [1, 2],
            minExperience: 2,
            limit: 10,
            offset: 0
        });
        expect(result.pagination.totalItems).toBe(1);
        expect(result.applications[0]).toEqual({
            applicationId: 10,
            userName: 'Nguyen Van A',
            experienceYears: 3,
            skills: ['NodeJS', 'Java'],
            status: 'Pending',
            appliedAt: '2026-03-15T12:00:00.000Z'
        });
    });

    it('should throw FORBIDDEN when employer has no company', async () => {
        CompanyRepository.findByUserId.mockResolvedValue(null);

        await expect(
            ApplicationService.getEmployerApplications(userId, { page: 1, limit: 10 })
        ).rejects.toMatchObject({
            status: HTTP_STATUS.FORBIDDEN,
            message: MESSAGES.FORBIDDEN
        });
    });
});

describe('ApplicationService.downloadCvForEmployer', () => {
    const userId = 'employer-user';
    const companyId = 200;
    const applicationId = 12;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return pdf buffer and update status when pending', async () => {
        const fileBuffer = Buffer.from('%PDF-1.4');
        CompanyRepository.findByUserId.mockResolvedValue({ companyId, userId });
        ApplicationRepository.findEmployerDownloadCvByApplicationId.mockResolvedValue({
            applicationId,
            status: 'Pending',
            jobPost: { companyId },
            resume: { fileUrl: 'https://cdn.example.com/cv.pdf', fileName: 'cv.pdf' }
        });
        ApplicationRepository.updateStatus.mockResolvedValue({});
        axios.mockResolvedValue({
            data: fileBuffer,
            headers: { 'content-type': 'application/pdf' }
        });

        const result = await ApplicationService.downloadCvForEmployer(userId, applicationId);

        expect(ApplicationRepository.updateStatus).toHaveBeenCalledWith(applicationId, 'Viewed');
        expect(axios).toHaveBeenCalled();
        expect(result).toEqual({
            fileName: 'cv.pdf',
            contentType: 'application/pdf',
            fileBuffer
        });
    });

    it('should throw forbidden when application not owned by employer company', async () => {
        CompanyRepository.findByUserId.mockResolvedValue({ companyId, userId });
        ApplicationRepository.findEmployerDownloadCvByApplicationId.mockResolvedValue({
            applicationId,
            status: 'Viewed',
            jobPost: { companyId: 999 },
            resume: { fileUrl: 'https://cdn.example.com/cv.pdf' }
        });

        await expect(ApplicationService.downloadCvForEmployer(userId, applicationId)).rejects.toMatchObject({
            status: HTTP_STATUS.FORBIDDEN,
            message: MESSAGES.FORBIDDEN
        });
    });
});
