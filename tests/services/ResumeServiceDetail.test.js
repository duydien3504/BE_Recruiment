const ResumeService = require('../../src/services/ResumeService');
const { ResumeRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ResumeService.getResumeDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const resumeId = 1;

    it('should return resume detail if owned by user', async () => {
        const mockResume = { resumesId: 1, userId: 'user-123', fileUrl: 'link' };
        ResumeRepository.findById.mockResolvedValue(mockResume);

        const result = await ResumeService.getResumeDetail(userId, resumeId);

        expect(ResumeRepository.findById).toHaveBeenCalledWith(resumeId);
        expect(result).toEqual(mockResume);
    });

    it('should throw FORBIDDEN if resume belongs to another user', async () => {
        const mockResume = { resumesId: 1, userId: 'other-user' };
        ResumeRepository.findById.mockResolvedValue(mockResume);

        await expect(ResumeService.getResumeDetail(userId, resumeId)).rejects.toThrow(MESSAGES.FORBIDDEN);
    });

    it('should throw NOT_FOUND if resume does not exist', async () => {
        ResumeRepository.findById.mockResolvedValue(null);

        await expect(ResumeService.getResumeDetail(userId, resumeId)).rejects.toThrow('CV không tồn tại.'); // Or check status
    });
});
