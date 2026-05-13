const CvBuilderController = require('../../src/controllers/CvBuilderController');
const CvBuilderService = require('../../src/services/CvBuilderService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CvBuilderService');

describe('CvBuilderController.updateCvDraft', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            user: { userId: 'u1' },
            body: { templateId: 't1', themeConfig: {}, cvData: {} }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    // ─── Luồng thành công: không gửi version (backward-compatible) ──────────

    test('should return 200 and success message on valid update without version', async () => {
        CvBuilderService.updateCvDraft.mockResolvedValue({ newAtsScore: 80 });

        await CvBuilderController.updateCvDraft(req, res, next);

        expect(CvBuilderService.updateCvDraft).toHaveBeenCalledWith('u1', req.body);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.UPDATE_CV_BUILDER_SUCCESS,
            newAtsScore: 80,
            newVersion: undefined
        });
        expect(next).not.toHaveBeenCalled();
    });

    // ─── Luồng thành công: có gửi version (Optimistic Locking) ─────────────

    test('should return 200 with newVersion when version is provided and update succeeds', async () => {
        req.body.version = 5;
        CvBuilderService.updateCvDraft.mockResolvedValue({ newAtsScore: 90, newVersion: 6 });

        await CvBuilderController.updateCvDraft(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.UPDATE_CV_BUILDER_SUCCESS,
            newAtsScore: 90,
            newVersion: 6
        });
        expect(next).not.toHaveBeenCalled();
    });

    // ─── Version Conflict → 409 ────────────────────────────────────────────

    test('should return 409 CONFLICT when service throws version conflict error', async () => {
        const conflictError = new Error(MESSAGES.CV_BUILDER_VERSION_CONFLICT);
        conflictError.status = HTTP_STATUS.CONFLICT;
        CvBuilderService.updateCvDraft.mockRejectedValue(conflictError);

        await CvBuilderController.updateCvDraft(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CONFLICT);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: MESSAGES.CV_BUILDER_VERSION_CONFLICT
        });
        // Không forward lên next() vì đã xử lý tại chỗ
        expect(next).not.toHaveBeenCalled();
    });

    // ─── Lỗi khác → forward qua next() ────────────────────────────────────

    test('should call next with error on non-conflict service failure', async () => {
        const error = new Error('Not found');
        CvBuilderService.updateCvDraft.mockRejectedValue(error);

        await CvBuilderController.updateCvDraft(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });
});
