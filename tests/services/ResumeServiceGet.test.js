const ResumeService = require('../../src/services/ResumeService');
const { ResumeRepository } = require('../../src/repositories');

jest.mock('../../src/repositories');

describe('ResumeService.getMyResumes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-123';

    it('should return list of resumes', async () => {
        const mockResumes = [
            { resumesId: 1, userId, fileName: 'cv1.pdf' },
            { resumesId: 2, userId, fileName: 'cv2.pdf' }
        ];
        ResumeRepository.findByUser.mockResolvedValue(mockResumes);

        const result = await ResumeService.getMyResumes(userId);

        expect(ResumeRepository.findByUser).toHaveBeenCalledWith(userId, {
            order: [['created_at', 'DESC']]
        });
        expect(result).toEqual(mockResumes);
    });

    it('should return empty list if no resumes found', async () => {
        ResumeRepository.findByUser.mockResolvedValue([]);

        const result = await ResumeService.getMyResumes(userId);

        expect(result).toEqual([]);
    });
});
