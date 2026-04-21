const { validateUpdateDraft } = require('../../src/validators/cvBuilderValidator');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

describe('cvBuilderValidator.validateUpdateDraft', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('should call next when body is valid', () => {
        req.body = {
            templateId: 'modern_01',
            themeConfig: { color: 'red' },
            cvData: { skills: [] }
        };

        validateUpdateDraft(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('should return 400 when templateId is missing', () => {
        req.body = {
            themeConfig: {},
            cvData: {}
        };

        validateUpdateDraft(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: MESSAGES.TEMPLATE_ID_REQUIRED
        }));
    });

    test('should return 400 when themeConfig is missing', () => {
        req.body = {
            templateId: 'x',
            cvData: {}
        };

        validateUpdateDraft(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: MESSAGES.THEME_CONFIG_REQUIRED
        }));
    });

    test('should return 400 when cvData is missing', () => {
        req.body = {
            templateId: 'x',
            themeConfig: {}
        };

        validateUpdateDraft(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: MESSAGES.CVDATA_REQUIRED
        }));
    });
});
