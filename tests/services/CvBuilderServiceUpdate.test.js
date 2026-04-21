const CvBuilderService = require('../../src/services/CvBuilderService');
const { CvBuilderRepository } = require('../../src/repositories');
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
    });

    test('should update draft successfully and return new ATS score', async () => {
        const payload = {
            templateId: 'new_temp',
            themeConfig: { a: 1 },
            cvData: { exper: [] }
        };

        CvBuilderRepository.findByUserId.mockResolvedValue({ id: MOCK_ID });
        AtsScorer.calculateScore.mockReturnValue(50);
        CvBuilderRepository.updateDraft.mockResolvedValue({});

        const result = await CvBuilderService.updateCvDraft(USER_ID, payload);

        expect(CvBuilderRepository.findByUserId).toHaveBeenCalledWith(USER_ID);
        expect(AtsScorer.calculateScore).toHaveBeenCalledWith(payload.cvData);
        expect(CvBuilderRepository.updateDraft).toHaveBeenCalledWith(MOCK_ID, {
            templateId: payload.templateId,
            themeConfig: payload.themeConfig,
            cvData: payload.cvData,
            atsScore: 50
        });
        expect(result).toEqual({ newAtsScore: 50 });
    });

    test('should throw 404 if draft not found for user', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue(null);

        await expect(CvBuilderService.updateCvDraft(USER_ID, {})).rejects.toMatchObject({
            status: HTTP_STATUS.NOT_FOUND,
            message: MESSAGES.CV_BUILDER_NOT_FOUND
        });

        expect(AtsScorer.calculateScore).not.toHaveBeenCalled();
        expect(CvBuilderRepository.updateDraft).not.toHaveBeenCalled();
    });
});
