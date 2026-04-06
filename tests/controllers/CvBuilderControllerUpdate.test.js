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

    test('should return 200 and success message on valid update', async () => {
        CvBuilderService.updateCvDraft.mockResolvedValue({ newAtsScore: 80 });

        await CvBuilderController.updateCvDraft(req, res, next);

        expect(CvBuilderService.updateCvDraft).toHaveBeenCalledWith('u1', req.body);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.UPDATE_CV_BUILDER_SUCCESS,
            newAtsScore: 80
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next with error on service failure', async () => {
        const error = new Error('Not found');
        CvBuilderService.updateCvDraft.mockRejectedValue(error);

        await CvBuilderController.updateCvDraft(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });
});
