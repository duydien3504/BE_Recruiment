const CvBuilderController = require('../../src/controllers/CvBuilderController');
const CvBuilderService = require('../../src/services/CvBuilderService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CvBuilderService');

describe('CvBuilderController.generateAiSuggestion', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                industry: 'IT',
                section: 'Kinh nghiệm',
                currentText: 'Tôi làm JS'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should return AI suggestions successfully', async () => {
        const mockSuggestions = ['Suggestion 1', 'Suggestion 2'];
        CvBuilderService.generateAiSuggestion.mockResolvedValue(mockSuggestions);

        await CvBuilderController.generateAiSuggestion(req, res, next);

        expect(CvBuilderService.generateAiSuggestion).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.AI_SUGGESTION_SUCCESS,
            data: { suggestions: mockSuggestions }
        });
    });

    it('should catch Timeout error and format to 504 status', async () => {
        const error = new Error('Yêu cầu tới AI bị quá thời gian (Timeout). Hãy thử lại sau.');
        CvBuilderService.generateAiSuggestion.mockRejectedValue(error);

        await CvBuilderController.generateAiSuggestion(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 504,
            message: MESSAGES.AI_SUGGESTION_TIMEOUT
        }));
    });

    it('should catch standard internal error and format to 500 status', async () => {
        const error = new Error('Unknown API error');
        CvBuilderService.generateAiSuggestion.mockRejectedValue(error);

        await CvBuilderController.generateAiSuggestion(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR
        }));
    });
});
