const CvBuilderController = require('../../src/controllers/CvBuilderController');
const CvBuilderService = require('../../src/services/CvBuilderService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CvBuilderService');

describe('CvBuilderController.getTemplates', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should return all templates successfully when no industry is provided', async () => {
        const mockTemplates = [{ templateId: 't1', category: 'IT' }];
        CvBuilderService.getTemplates.mockResolvedValue(mockTemplates);

        await CvBuilderController.getTemplates(req, res, next);

        expect(CvBuilderService.getTemplates).toHaveBeenCalledWith(undefined);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.GET_TEMPLATES_SUCCESS,
            data: mockTemplates
        });
    });

    it('should pass industry query to the service and return templates', async () => {
        req.query.industry = 'IT';
        const mockTemplates = [{ templateId: 't1', category: 'IT' }];
        CvBuilderService.getTemplates.mockResolvedValue(mockTemplates);

        await CvBuilderController.getTemplates(req, res, next);

        expect(CvBuilderService.getTemplates).toHaveBeenCalledWith('IT');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.GET_TEMPLATES_SUCCESS,
            data: mockTemplates
        });
    });

    it('should call next with error if service throws', async () => {
        const error = new Error('Internal Error');
        CvBuilderService.getTemplates.mockRejectedValue(error);

        await CvBuilderController.getTemplates(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
