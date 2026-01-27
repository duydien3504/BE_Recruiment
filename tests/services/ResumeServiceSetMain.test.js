const ResumeService = require('../../src/services/ResumeService');
const { ResumeRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ResumeService.setMainResume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const resumeId = 1;

    it('should set main resume successfully', async () => {
        const mockResume = { resumesId: 1, userId: 'user-123', isMain: false };
        ResumeRepository.findById.mockResolvedValue(mockResume);
        ResumeRepository.setMainResume.mockResolvedValue([1]);

        await ResumeService.setMainResume(userId, resumeId);

        expect(ResumeRepository.findById).toHaveBeenCalledWith(resumeId);
        expect(ResumeRepository.setMainResume).toHaveBeenCalledWith(resumeId, userId);
    });

    it('should throw FORBIDDEN if resume belongs to another user', async () => {
        const mockResume = { resumesId: 1, userId: 'other-user' };
        ResumeRepository.findById.mockResolvedValue(mockResume);

        await expect(ResumeService.setMainResume(userId, resumeId)).rejects.toThrow(MESSAGES.FORBIDDEN);
        expect(ResumeRepository.setMainResume).not.toHaveBeenCalled();
    });

    it('should throw NOT_FOUND if resume does not exist', async () => {
        ResumeRepository.findById.mockResolvedValue(null);

        await expect(ResumeService.setMainResume(userId, resumeId)).rejects.toThrow(MESSAGES.RESUME_NOT_FOUND);
        expect(ResumeRepository.setMainResume).not.toHaveBeenCalled();
    });
});
