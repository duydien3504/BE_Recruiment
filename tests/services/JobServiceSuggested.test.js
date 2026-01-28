const JobService = require('../../src/services/JobService');
const { JobPostRepository, ResumeRepository } = require('../../src/repositories');
const AIService = require('../../src/services/AIService');
const HTTP_STATUS = require('../../src/constant/statusCode');

// Mock external libraries
jest.mock('axios');
jest.mock('pdf-parse', () => jest.fn()); // We need to mock pdf-parse

const axios = require('axios');
const pdf = require('pdf-parse');

jest.mock('../../src/repositories', () => ({
    JobPostRepository: {
        search: jest.fn()
    },
    ResumeRepository: {
        findMainResume: jest.fn()
    },
    // Mock other repos to avoid undefined errors during Service require
    CompanyRepository: {},
    TransactionRepository: {},
    UserRepository: {},
    ApplicationRepository: {},
    InterviewRepository: {},
    CategoryRepository: {},
    LocationRepository: {},
    JobSkillRepository: {},
    SkillRepository: {}
}));

jest.mock('../../src/services/AIService', () => ({
    getSuggestionsWithResume: jest.fn()
}));

describe('JobService - getSuggestedJobs PDF Integration', () => {
    const userId = 'user-123';
    const mockResume = {
        resumesId: 1,
        userId: userId,
        fileUrl: 'https://example.com/cv.pdf',
        isMain: true
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should throw error if user has no main resume', async () => {
        ResumeRepository.findMainResume.mockResolvedValue(null);

        await expect(JobService.getSuggestedJobs(userId))
            .rejects
            .toMatchObject({
                message: 'Bạn cần tải lên CV và đặt làm CV chính trước khi sử dụng tính năng này.',
                status: HTTP_STATUS.BAD_REQUEST
            });
    });

    it('should process resume PDF and call AI', async () => {
        // Mock Resume
        ResumeRepository.findMainResume.mockResolvedValue(mockResume);

        // Mock Axios (Download PDF)
        axios.get.mockResolvedValue({
            data: Buffer.from('fake pdf content')
        });

        // Mock PDF Parse (Extract Text)
        pdf.mockResolvedValue({
            text: 'User Skills: NodeJS, React'
        });

        // Mock Jobs
        JobPostRepository.search.mockResolvedValue({
            rows: [
                { jobPostId: 1, title: 'NodeJS Dev' }
            ]
        });

        // Mock AI Service
        const mockSuggestions = {
            data: [
                { jobId: 1, match_score: 95, reason: 'Matched Skills' }
            ]
        };
        AIService.getSuggestionsWithResume.mockResolvedValue(mockSuggestions);

        const result = await JobService.getSuggestedJobs(userId);

        expect(axios.get).toHaveBeenCalledWith(mockResume.fileUrl, expect.objectContaining({ responseType: 'arraybuffer' }));
        expect(pdf).toHaveBeenCalled();
        expect(AIService.getSuggestionsWithResume).toHaveBeenCalledWith(expect.stringContaining('User Skills: NodeJS, React'), expect.any(Array));
        expect(result).toEqual(mockSuggestions);
    });

    it('should throw error if PDF fetching fails', async () => {
        ResumeRepository.findMainResume.mockResolvedValue(mockResume);
        axios.get.mockRejectedValue(new Error('Network Error'));

        await expect(JobService.getSuggestedJobs(userId))
            .rejects
            .toHaveProperty('message', 'Không thể đọc nội dung file CV của bạn. Vui lòng thử lại hoặc tải lên file khác.');
    });

    it('should return empty list if AI fails', async () => {
        ResumeRepository.findMainResume.mockResolvedValue(mockResume);
        axios.get.mockResolvedValue({ data: Buffer.from('pdf') });
        pdf.mockResolvedValue({ text: 'text' });
        JobPostRepository.search.mockResolvedValue({ rows: [{ id: 1 }] });

        AIService.getSuggestionsWithResume.mockRejectedValue(new Error('AI Error'));

        const result = await JobService.getSuggestedJobs(userId);
        expect(result).toEqual({ data: [] });
    });
});
