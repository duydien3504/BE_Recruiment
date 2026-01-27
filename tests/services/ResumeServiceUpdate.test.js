const ResumeService = require('../../src/services/ResumeService');
const { ResumeRepository } = require('../../src/repositories');
const uploadService = require('../../src/utils/uploadService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');
jest.mock('../../src/utils/uploadService');

describe('ResumeService.updateResume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';
    const resumeId = 1;
    const mockFile = {
        buffer: Buffer.from('new content'),
        originalname: 'NewCV.pdf'
    };

    it('should update resume successfully', async () => {
        const mockResume = { resumesId: 1, userId };
        ResumeRepository.findById.mockResolvedValue(mockResume);
        uploadService.uploadToCloudinary.mockResolvedValue('new-link');
        ResumeRepository.update.mockResolvedValue({ ...mockResume, fileUrl: 'new-link' });

        const result = await ResumeService.updateResume(userId, resumeId, mockFile);

        expect(ResumeRepository.findById).toHaveBeenCalledWith(resumeId);
        expect(uploadService.uploadToCloudinary).toHaveBeenCalled();
        expect(ResumeRepository.update).toHaveBeenCalledWith(resumeId, {
            fileUrl: 'new-link',
            fileName: 'NewCV.pdf'
        });
        expect(result).toBeDefined();
    });

    it('should throw FORBIDDEN if resume belongs to another user', async () => {
        const mockResume = { resumesId: 1, userId: 'other-user' };
        ResumeRepository.findById.mockResolvedValue(mockResume);

        await expect(ResumeService.updateResume(userId, resumeId, mockFile)).rejects.toThrow(MESSAGES.FORBIDDEN);
        expect(uploadService.uploadToCloudinary).not.toHaveBeenCalled();
    });

    it('should throw NOT_FOUND if resume does not exist', async () => {
        ResumeRepository.findById.mockResolvedValue(null);

        await expect(ResumeService.updateResume(userId, resumeId, mockFile)).rejects.toThrow('CV không tồn tại.');
    });
});
