const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository, JobPostRepository, ResumeRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

// Mock all repositories
jest.mock('../../src/repositories');

// Mock CompanyRepository (used in notification logic)
jest.mock('../../src/repositories/CompanyRepository', () => ({
    findById: jest.fn()
}));

// Mock UserRepository (used in notification logic)
jest.mock('../../src/repositories/UserRepository', () => ({
    findById: jest.fn()
}));

// Mock SocketService (used in notification logic)
jest.mock('../../src/services/SocketService', () => ({
    saveAndSendNotification: jest.fn()
}));

describe('ApplicationService.createApplication', () => {
    let CompanyRepository;
    let UserRepository;
    let SocketService;

    beforeAll(() => {
        // Get mocked modules
        CompanyRepository = require('../../src/repositories/CompanyRepository');
        UserRepository = require('../../src/repositories/UserRepository');
        SocketService = require('../../src/services/SocketService');
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks for notification dependencies
        CompanyRepository.findById.mockResolvedValue({
            companyId: 1,
            userId: 'employer-123'
        });
        UserRepository.findById.mockResolvedValue({
            userId: 'user-123',
            fullName: 'Test User'
        });
        SocketService.saveAndSendNotification.mockResolvedValue(true);
    });

    const userId = 'user-123';
    const data = {
        jobPostId: 1,
        resumesId: 10,
        coverLetter: 'My cover letter'
    };

    it('should create application successfully', async () => {
        JobPostRepository.findById.mockResolvedValue({
            jobPostId: 1,
            companyId: 1,
            title: 'Software Engineer'
        });
        ResumeRepository.findById.mockResolvedValue({ resumesId: 10, userId: userId });
        ApplicationRepository.checkExistingApplication.mockResolvedValue(null);
        ApplicationRepository.create.mockResolvedValue({
            applicationId: 1,
            ...data,
            userId,
            status: 'Pending'
        });

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
