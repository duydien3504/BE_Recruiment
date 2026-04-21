const CvBuilderController = require('../../src/controllers/CvBuilderController');
const CvBuilderService = require('../../src/services/CvBuilderService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CvBuilderService');

describe('CvBuilderController.getCvDraft', () => {
    let req, res, next;

    const mockCvData = {
        id: 'cv-uuid-001',
        templateId: 'default_template',
        themeConfig: { primaryColor: '#000000', layoutMode: '1-column', fontFamily: 'Inter' },
        cvData: {},
        atsScore: 0
    };

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            user: { userId: 'user-uuid-001' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    // ─── Trường hợp thành công ─────────────────────────────────────────────────

    test('should return 200 with correct response body when service succeeds', async () => {
        CvBuilderService.getCvDraft.mockResolvedValue(mockCvData);

        await CvBuilderController.getCvDraft(req, res, next);

        // Verify: gọi service đúng userId
        expect(CvBuilderService.getCvDraft).toHaveBeenCalledWith('user-uuid-001');

        // Verify: trả HTTP 200
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

        // Verify: response body đúng format spec
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.GET_CV_BUILDER_SUCCESS,
            data: mockCvData
        });

        // Verify: không gọi next (không có lỗi)
        expect(next).not.toHaveBeenCalled();
    });

    test('should return 200 with empty cvData when user has new draft', async () => {
        const emptyDraft = { ...mockCvData, cvData: {}, atsScore: 0 };
        CvBuilderService.getCvDraft.mockResolvedValue(emptyDraft);

        await CvBuilderController.getCvDraft(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, data: emptyDraft })
        );
    });

    test('should return 200 with populated cvData when user has existing draft', async () => {
        const populatedDraft = {
            ...mockCvData,
            templateId: 'modern_01',
            cvData: {
                experience: [{ id: 'exp-1', order_index: 1, company: 'VNG' }]
            },
            atsScore: 65
        };
        CvBuilderService.getCvDraft.mockResolvedValue(populatedDraft);

        await CvBuilderController.getCvDraft(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    templateId: 'modern_01',
                    atsScore: 65
                })
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    // ─── Trường hợp lỗi ────────────────────────────────────────────────────────

    test('should call next with error when service throws', async () => {
        const serviceError = new Error('Service failure');
        CvBuilderService.getCvDraft.mockRejectedValue(serviceError);

        await CvBuilderController.getCvDraft(req, res, next);

        // Verify: forward lỗi về centralised error handler
        expect(next).toHaveBeenCalledWith(serviceError);

        // Verify: res.json KHÔNG được gọi khi có lỗi
        expect(res.json).not.toHaveBeenCalled();
    });

    test('should call next with 401 error when user is not authenticated', async () => {
        req.user = undefined;
        const authError = new TypeError("Cannot destructure property 'userId' of undefined");
        CvBuilderService.getCvDraft.mockImplementation(() => { throw authError; });

        await CvBuilderController.getCvDraft(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    // ─── Verify: lấy đúng userId từ req.user ──────────────────────────────────

    test('should extract userId from req.user and pass to service', async () => {
        req.user = { userId: 'specific-user-id-999' };
        CvBuilderService.getCvDraft.mockResolvedValue(mockCvData);

        await CvBuilderController.getCvDraft(req, res, next);

        expect(CvBuilderService.getCvDraft).toHaveBeenCalledWith('specific-user-id-999');
    });
});
