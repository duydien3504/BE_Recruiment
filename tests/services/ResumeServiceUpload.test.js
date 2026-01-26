const ResumeService = require('../../src/services/ResumeService');
const { ResumeRepository } = require('../../src/repositories');
const uploadService = require('../../src/utils/uploadService');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories');
jest.mock('../../src/utils/uploadService');

describe('ResumeService.uploadResume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'CV.pdf',
        size: 1024,
        mimetype: 'application/pdf'
    };
    const userId = 'user-123';

    it('should upload resume successfully', async () => {
        ResumeRepository.countByUser.mockResolvedValue(0);
        ResumeRepository.countUploadedToday.mockResolvedValue(0);
        uploadService.uploadToCloudinary.mockResolvedValue('https://cloudinary.com/cv.pdf');
        ResumeRepository.create.mockResolvedValue({
            resumesId: 1,
            userId,
            fileUrl: 'https://cloudinary.com/cv.pdf',
            fileName: 'CV.pdf',
            isMain: true
        });

        const result = await ResumeService.uploadResume(userId, mockFile);

        expect(ResumeRepository.countByUser).toHaveBeenCalledWith(userId);
        expect(ResumeRepository.countUploadedToday).toHaveBeenCalledWith(userId);
        expect(uploadService.uploadToCloudinary).toHaveBeenCalled();
        expect(ResumeRepository.create).toHaveBeenCalledWith({
            userId,
            fileUrl: 'https://cloudinary.com/cv.pdf',
            fileName: 'CV.pdf',
            isMain: true
        });
        expect(result).toBeDefined();
    });

    it('should throw error if quota exceeded', async () => {
        ResumeRepository.countByUser.mockResolvedValue(5);

        await expect(ResumeService.uploadResume(userId, mockFile)).rejects.toThrow('Bạn chỉ được phép lưu tối đa 5 hồ sơ');
        expect(uploadService.uploadToCloudinary).not.toHaveBeenCalled();
    });

    it('should throw error if daily limit exceeded', async () => {
        ResumeRepository.countByUser.mockResolvedValue(2);
        ResumeRepository.countUploadedToday.mockResolvedValue(2);

        await expect(ResumeService.uploadResume(userId, mockFile)).rejects.toThrow('Bạn chỉ được phép tải lên tối đa 2 hồ sơ trong một ngày');
        expect(uploadService.uploadToCloudinary).not.toHaveBeenCalled();
    });
});
