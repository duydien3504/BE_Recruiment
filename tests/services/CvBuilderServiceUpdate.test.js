const CvBuilderService = require('../../src/services/CvBuilderService');
const { CvBuilderRepository, CvTemplateRepository } = require('../../src/repositories');
const AtsScorer = require('../../src/utils/AtsScorer');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');
jest.mock('../../src/utils/AtsScorer');

describe('CvBuilderService.updateCvDraft', () => {
    const USER_ID = 'user-001';
    const MOCK_ID = 'cv-id-001';

    beforeEach(() => {
        jest.clearAllMocks();
        // Default: CvTemplateRepository.findActiveById trả về template hợp lệ
        CvTemplateRepository.findActiveById = jest.fn().mockResolvedValue({ id: 'new_temp', ejsPath: 'path' });
    });

    // ─── Luồng cũ: backward-compatible (không gửi version) ─────────────────

    test('should update draft successfully WITHOUT version (Last Write Wins fallback)', async () => {
        const payload = {
            templateId: 'new_temp',
            themeConfig: { a: 1 },
            cvData: { exper: [] }
            // Không gửi version → fallback Last Write Wins
        };

        CvBuilderRepository.findByUserId.mockResolvedValue({ id: MOCK_ID });
        AtsScorer.calculateScore.mockReturnValue(50);
        CvBuilderRepository.updateDraft.mockResolvedValue({ version: 2 });

        const result = await CvBuilderService.updateCvDraft(USER_ID, payload);

        expect(CvBuilderRepository.findByUserId).toHaveBeenCalledWith(USER_ID);
        expect(AtsScorer.calculateScore).toHaveBeenCalledWith(payload.cvData);
        expect(CvBuilderRepository.updateDraft).toHaveBeenCalledWith(MOCK_ID, {
            templateId: payload.templateId,
            themeConfig: payload.themeConfig,
            cvData: payload.cvData,
            atsScore: 50
        });
        expect(result).toEqual({ newAtsScore: 50, newVersion: 2 });
        // Không gọi updateDraftWithVersion
        expect(CvBuilderRepository.updateDraftWithVersion).not.toHaveBeenCalled();
    });

    // ─── Luồng mới: Optimistic Locking (gửi version) ───────────────────────

    test('should update draft successfully WITH version and return newVersion', async () => {
        const payload = {
            templateId: 'new_temp',
            themeConfig: { a: 1 },
            cvData: { exper: [] },
            version: 3
        };

        CvBuilderRepository.findByUserId.mockResolvedValue({ id: MOCK_ID });
        AtsScorer.calculateScore.mockReturnValue(75);
        CvBuilderRepository.updateDraftWithVersion.mockResolvedValue({ version: 4 });

        const result = await CvBuilderService.updateCvDraft(USER_ID, payload);

        expect(CvBuilderRepository.updateDraftWithVersion).toHaveBeenCalledWith(
            MOCK_ID,
            { templateId: 'new_temp', themeConfig: { a: 1 }, cvData: { exper: [] }, atsScore: 75 },
            3
        );
        // Không gọi updateDraft (dùng updateDraftWithVersion thay)
        expect(CvBuilderRepository.updateDraft).not.toHaveBeenCalled();
        expect(result).toEqual({ newAtsScore: 75, newVersion: 4 });
    });

    // ─── Optimistic Locking: Version Conflict → 409 ────────────────────────

    test('should throw 409 CONFLICT when version does not match (Optimistic Lock)', async () => {
        const payload = {
            templateId: 'new_temp',
            themeConfig: {},
            cvData: {},
            version: 5 // Version cũ, DB đã là 6
        };

        CvBuilderRepository.findByUserId.mockResolvedValue({ id: MOCK_ID });
        AtsScorer.calculateScore.mockReturnValue(40);
        // updateDraftWithVersion trả về null → version conflict
        CvBuilderRepository.updateDraftWithVersion.mockResolvedValue(null);

        await expect(CvBuilderService.updateCvDraft(USER_ID, payload)).rejects.toMatchObject({
            status: HTTP_STATUS.CONFLICT,
            message: MESSAGES.CV_BUILDER_VERSION_CONFLICT
        });
    });

    // ─── Trường hợp: user chưa có draft → tạo mới, rồi update ─────────────

    test('should create default draft then update when user has no existing draft', async () => {
        const payload = {
            templateId: 'new_temp',
            themeConfig: {},
            cvData: { about: 'Hello' }
        };

        CvBuilderRepository.findByUserId.mockResolvedValue(null);
        CvBuilderRepository.createDefault.mockResolvedValue({ id: 'new-cv-id' });
        AtsScorer.calculateScore.mockReturnValue(30);
        CvBuilderRepository.updateDraft.mockResolvedValue({ version: 2 });

        const result = await CvBuilderService.updateCvDraft(USER_ID, payload);

        expect(CvBuilderRepository.createDefault).toHaveBeenCalledWith(USER_ID);
        expect(CvBuilderRepository.updateDraft).toHaveBeenCalledWith('new-cv-id', expect.objectContaining({
            atsScore: 30
        }));
        expect(result).toEqual({ newAtsScore: 30, newVersion: 2 });
    });

    // ─── Trường hợp: cả findByUserId và createDefault đều thất bại → 500 ──

    test('should throw 500 if unable to init draft (findByUserId=null, createDefault=null)', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue(null);
        CvBuilderRepository.createDefault.mockResolvedValue(null);

        await expect(CvBuilderService.updateCvDraft(USER_ID, {})).rejects.toMatchObject({
            status: 500,
            message: 'Không thể khởi tạo bản nháp CV.'
        });

        expect(AtsScorer.calculateScore).not.toHaveBeenCalled();
        expect(CvBuilderRepository.updateDraft).not.toHaveBeenCalled();
    });
});
