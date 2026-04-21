const CvBuilderService = require('../../src/services/CvBuilderService');
const { CvBuilderRepository } = require('../../src/repositories');

jest.mock('../../src/repositories');

describe('CvBuilderService.getCvDraft', () => {
    const USER_ID = 'user-uuid-001';

    const mockCvBuilderRecord = {
        id: 'cv-uuid-001',
        userId: USER_ID,
        templateId: 'default_template',
        themeConfig: { primaryColor: '#000000', layoutMode: '1-column', fontFamily: 'Inter' },
        cvData: {},
        atsScore: 0
    };

    const expectedFormattedResponse = {
        id: 'cv-uuid-001',
        templateId: 'default_template',
        themeConfig: { primaryColor: '#000000', layoutMode: '1-column', fontFamily: 'Inter' },
        cvData: {},
        atsScore: 0
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── Trường hợp: user đã có bản nháp ──────────────────────────────────────

    test('should return existing CvBuilder draft when user already has one', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue(mockCvBuilderRecord);

        const result = await CvBuilderService.getCvDraft(USER_ID);

        // Verify: chỉ gọi findByUserId, KHÔNG gọi createDefault
        expect(CvBuilderRepository.findByUserId).toHaveBeenCalledWith(USER_ID);
        expect(CvBuilderRepository.createDefault).not.toHaveBeenCalled();

        // Verify: response được format đúng cấu trúc
        expect(result).toEqual(expectedFormattedResponse);
    });

    // ─── Trường hợp: user chưa có bản nháp (first-time) ──────────────────────

    test('should auto-create and return default draft when user has no existing draft', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue(null);
        CvBuilderRepository.createDefault.mockResolvedValue(mockCvBuilderRecord);

        const result = await CvBuilderService.getCvDraft(USER_ID);

        // Verify: gọi findByUserId trước, sau đó createDefault vì null
        expect(CvBuilderRepository.findByUserId).toHaveBeenCalledWith(USER_ID);
        expect(CvBuilderRepository.createDefault).toHaveBeenCalledWith(USER_ID);

        // Verify: trả về đúng format
        expect(result).toEqual(expectedFormattedResponse);
    });

    // ─── Trường hợp: response format đúng cấu trúc ────────────────────────────

    test('should correctly format response — only expose allowed fields', async () => {
        const rawRecord = {
            ...mockCvBuilderRecord,
            // Các field nhạy cảm không nên lộ ra ngoài
            userId: USER_ID,
            created_at: '2026-01-01',
            updated_at: '2026-01-01'
        };
        CvBuilderRepository.findByUserId.mockResolvedValue(rawRecord);

        const result = await CvBuilderService.getCvDraft(USER_ID);

        // Chỉ chứa các field đã khai báo trong _formatResponse
        expect(Object.keys(result)).toEqual(['id', 'templateId', 'themeConfig', 'cvData', 'atsScore']);
        // Không expose userId hay timestamps
        expect(result).not.toHaveProperty('userId');
        expect(result).not.toHaveProperty('created_at');
        expect(result).not.toHaveProperty('updated_at');
    });

    // ─── Trường hợp: propagate DB error ────────────────────────────────────────

    test('should throw error when repository findByUserId fails', async () => {
        const dbError = new Error('DB connection lost');
        CvBuilderRepository.findByUserId.mockRejectedValue(dbError);

        await expect(CvBuilderService.getCvDraft(USER_ID)).rejects.toThrow('DB connection lost');
        expect(CvBuilderRepository.createDefault).not.toHaveBeenCalled();
    });

    test('should throw error when createDefault fails after findByUserId returns null', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue(null);
        const dbError = new Error('Insert failed');
        CvBuilderRepository.createDefault.mockRejectedValue(dbError);

        await expect(CvBuilderService.getCvDraft(USER_ID)).rejects.toThrow('Insert failed');
    });

    // ─── Trường hợp: cvData/themeConfig là JSON phức tạp ──────────────────────

    test('should preserve complex nested cvData structure in response', async () => {
        const complexRecord = {
            ...mockCvBuilderRecord,
            cvData: {
                experience: [
                    { id: 'exp-1', order_index: 1, company: 'VNG', description: 'Backend Dev', isVisible: true }
                ],
                skills: { displayStyle: 'progressbar', items: [{ name: 'Node.js', level: 80 }] }
            },
            themeConfig: { primaryColor: '#1A73E8', layoutConfig: '2-column', fontFamily: 'Roboto' },
            atsScore: 65
        };
        CvBuilderRepository.findByUserId.mockResolvedValue(complexRecord);

        const result = await CvBuilderService.getCvDraft(USER_ID);

        expect(result.cvData.experience).toHaveLength(1);
        expect(result.cvData.experience[0].order_index).toBe(1);
        expect(result.cvData.skills.displayStyle).toBe('progressbar');
        expect(result.themeConfig.layoutConfig).toBe('2-column');
        expect(result.atsScore).toBe(65);
    });
});
