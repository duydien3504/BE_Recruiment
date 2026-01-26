const ResumeService = require('../../src/services/ResumeService');
const { ResumeRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('ResumeService.deleteResume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const resumeId = 1;

    it('should delete resume successfully if owned by user', async () => {
        const mockResume = { resumesId: 1, userId: 'user-123' };
        ResumeRepository.findById.mockResolvedValue(mockResume);
        ResumeRepository.softDelete.mockResolvedValue(true);

        const result = await ResumeService.deleteResume(userId, resumeId);

        expect(ResumeRepository.findById).toHaveBeenCalledWith(resumeId);
        expect(ResumeRepository.softDelete).toHaveBeenCalledWith(resumeId);
        expect(result).toBe(true);
    });

    it('should throw FORBIDDEN if resume belongs to another user', async () => {
        const mockResume = { resumesId: 1, userId: 'other-user' };
        ResumeRepository.findById.mockResolvedValue(mockResume);

        await expect(ResumeService.deleteResume(userId, resumeId)).rejects.toThrow(MESSAGES.FORBIDDEN);
        expect(ResumeRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw NOT_FOUND if resume does not exist', async () => {
        ResumeRepository.findById.mockResolvedValue(null);

        await expect(ResumeService.deleteResume(userId, resumeId)).rejects.toThrow('CV không tồn tại.'); // Or check exact message or status
    });
});
