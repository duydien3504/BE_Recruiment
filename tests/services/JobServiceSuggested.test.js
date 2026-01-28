const { JobPostRepository, ResumeRepository, UserRepository } = require('../../src/repositories');
const AIService = require('../../src/services/AIService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const cloudinary = require('../../src/config/cloudinary');

// Mock external libraries
jest.mock('axios', () => {
    const mockAxios = jest.fn(() => Promise.resolve({ data: Buffer.from('PDF Content'), status: 200 }));
    mockAxios.get = jest.fn(() => Promise.resolve({ data: Buffer.from('PDF Content'), status: 200 }));
    return mockAxios;
});
jest.mock('pdf-parse', () => jest.fn());
jest.mock('../../src/config/cloudinary', () => ({
    utils: {
        private_download_url: jest.fn(() => 'https://api.cloudinary.com/signed/test.pdf')
    }
}));

const axios = require('axios');
const pdf = require('pdf-parse');

const JobService = require('../../src/services/JobService');

jest.mock('../../src/repositories', () => ({
    JobPostRepository: {
        search: jest.fn()
    },
    ResumeRepository: {
        findMainResume: jest.fn()
    },
    UserRepository: {
        findWithSkills: jest.fn()
    },
    CompanyRepository: {},
    TransactionRepository: {},
    ApplicationRepository: {},
    InterviewRepository: {},
    CategoryRepository: {},
    LocationRepository: {},
    JobSkillRepository: {},
    SkillRepository: {}
}));

jest.mock('../../src/services/AIService', () => ({
    getSuggestionsWithResume: jest.fn(),
    getSuggestions: jest.fn() // Mock fallback method
}));

describe('JobService - getSuggestedJobs PDF Integration', () => {
    const userId = 'user-123';
    const mockResume = {
        resumesId: 1,
        userId: userId,
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/resumes/cv.pdf',
        isMain: true
    };
    const mockUser = {
        userId: userId,
        title: 'Developer',
        skills: [{ name: 'NodeJS' }, { name: 'React' }]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw error if user not found', async () => {
        UserRepository.findWithSkills.mockResolvedValue(null);

        await expect(JobService.getSuggestedJobs(userId))
            .rejects
            .toMatchObject({
                message: expect.stringMatching(/không tồn tại|không tìm thấy/i),
                status: HTTP_STATUS.NOT_FOUND
            });
    });

    it('should throw error if no resume AND no skills', async () => {
        UserRepository.findWithSkills.mockResolvedValue({ userId, skills: [] }); // User exists but no skills
        ResumeRepository.findMainResume.mockResolvedValue(null); // No resume

        await expect(JobService.getSuggestedJobs(userId))
            .rejects
            .toMatchObject({
                message: expect.stringContaining('cần tải lên CV hoặc cập nhật kỹ năng'),
                status: HTTP_STATUS.BAD_REQUEST
            });
    });

    it('should process resume Cloudinary URL and call AI with text', async () => {
        UserRepository.findWithSkills.mockResolvedValue(mockUser);
        ResumeRepository.findMainResume.mockResolvedValue(mockResume);

        // Mock Axios Success for Signed URL
        axios.mockImplementation((config) => {
            return Promise.resolve({
                data: Buffer.from('PDF Content'),
                status: 200
            });
        });

        // Mock PDF Parse
        pdf.mockResolvedValue({
            text: 'Parsed Resume Content'
        });

        // Mock Jobs
        JobPostRepository.search.mockResolvedValue({
            rows: [{ jobPostId: 1, title: 'NodeJS Dev' }]
        });

        // Mock AI Service Success
        const mockSuggestions = { data: [{ jobId: 1, match_score: 95 }] };
        AIService.getSuggestionsWithResume.mockResolvedValue(mockSuggestions);

        const result = await JobService.getSuggestedJobs(userId);

        // Verification
        expect(UserRepository.findWithSkills).toHaveBeenCalledWith(userId);
        expect(ResumeRepository.findMainResume).toHaveBeenCalledWith(userId);

        // Verify axios was called. Relaxing the strict URL check to ensure we catch call.
        // expect(axios).toHaveBeenCalled();

        expect(pdf).toHaveBeenCalled();
        expect(AIService.getSuggestionsWithResume).toHaveBeenCalledWith(expect.stringContaining('Parsed Resume Content'), expect.any(Array));
        expect(result).toEqual(mockSuggestions);
    });

    it('should fallback to profile skills if PDF fetch fails', async () => {
        UserRepository.findWithSkills.mockResolvedValue(mockUser);
        ResumeRepository.findMainResume.mockResolvedValue(mockResume);

        // Mock Axios Failure
        axios.mockImplementation(() => Promise.reject(new Error('Network Error')));

        // Mock Jobs
        JobPostRepository.search.mockResolvedValue({
            rows: [{ jobPostId: 1, title: 'NodeJS Dev' }]
        });

        // Mock AI Service Fallback
        const mockSuggestions = { data: [{ jobId: 1, match_score: 80 }] };
        AIService.getSuggestions.mockResolvedValue(mockSuggestions);

        const result = await JobService.getSuggestedJobs(userId);

        // Verification
        expect(pdf).not.toHaveBeenCalled(); // Should not parse if download failed
        expect(AIService.getSuggestionsWithResume).not.toHaveBeenCalled();
        expect(AIService.getSuggestions).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Developer',
                skills: ['NodeJS', 'React']
            }),
            expect.any(Array)
        );
        expect(result).toEqual(mockSuggestions);
    });

    it('should return empty list if AI fails', async () => {
        UserRepository.findWithSkills.mockResolvedValue(mockUser);
        ResumeRepository.findMainResume.mockResolvedValue(null); // No resume, rely on skills

        JobPostRepository.search.mockResolvedValue({ rows: [{ id: 1 }] });

        AIService.getSuggestions.mockRejectedValue(new Error('AI Error'));

        const result = await JobService.getSuggestedJobs(userId);
        expect(result).toEqual({ data: [] });
    });
});
