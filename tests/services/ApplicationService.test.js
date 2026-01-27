const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository, JobPostRepository, ResumeRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ApplicationService.createApplication', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const data = {
        jobPostId: 1,
        resumesId: 10,
        coverLetter: 'My cover letter'
    };

    it('should create application successfully', async () => {
        JobPostRepository.findById.mockResolvedValue({ jobPostId: 1 });
        ResumeRepository.findById.mockResolvedValue({ resumesId: 10, userId: userId });
        ApplicationRepository.checkExistingApplication.mockResolvedValue(null);
        ApplicationRepository.create.mockResolvedValue({ ...data, userId, status: 'Pending' });

        const result = await ApplicationService.createApplication(userId, data);

        expect(JobPostRepository.findById).toHaveBeenCalledWith(1);
        expect(ResumeRepository.findById).toHaveBeenCalledWith(10);
        expect(ApplicationRepository.checkExistingApplication).toHaveBeenCalledWith(userId, 1);
        expect(ApplicationRepository.create).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({ status: 'Pending' }));
    });

    it('should throw NOT_FOUND if job does not exist', async () => {
        JobPostRepository.findById.mockResolvedValue(null);

        await expect(ApplicationService.createApplication(userId, data)).rejects.toThrow(MESSAGES.JOB_NOT_FOUND);
    });

    it('should throw NOT_FOUND if resume does not exist', async () => {
        JobPostRepository.findById.mockResolvedValue({ jobPostId: 1 });
        ResumeRepository.findById.mockResolvedValue(null);

        await expect(ApplicationService.createApplication(userId, data)).rejects.toThrow();
    });

    it('should throw FORBIDDEN if resume does not belong to user', async () => {
        JobPostRepository.findById.mockResolvedValue({ jobPostId: 1 });
        ResumeRepository.findById.mockResolvedValue({ resumesId: 10, userId: 'other-user' });

        await expect(ApplicationService.createApplication(userId, data)).rejects.toThrow(MESSAGES.OWNER_RESUME_REQUIRED);
    });

    it('should throw BAD_REQUEST if already applied', async () => {
        JobPostRepository.findById.mockResolvedValue({ jobPostId: 1 });
        ResumeRepository.findById.mockResolvedValue({ resumesId: 10, userId: userId });
        ApplicationRepository.checkExistingApplication.mockResolvedValue({ applicationId: 99 });

        await expect(ApplicationService.createApplication(userId, data)).rejects.toThrow(MESSAGES.ALREADY_APPLIED);
    });
});
