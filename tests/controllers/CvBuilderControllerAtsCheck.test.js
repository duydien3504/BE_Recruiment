const CvBuilderController = require('../../src/controllers/CvBuilderController');
const CvBuilderService = require('../../src/services/CvBuilderService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CvBuilderService');

describe('CvBuilderController.checkAtsMatch', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                cvText: 'React JS Dev',
                jdText: 'Need Vue JS Dev'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should return ATS evaluation successfully', async () => {
        const mockData = {
            matchPercentage: 30,
            missingKeywords: ['Vue JS'],
            recommendations: ['Học thêm Vue']
        };
        CvBuilderService.checkAtsMatch.mockResolvedValue(mockData);

        await CvBuilderController.checkAtsMatch(req, res, next);

        expect(CvBuilderService.checkAtsMatch).toHaveBeenCalledWith(req.body.cvText, req.body.jdText);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.ATS_CHECK_SUCCESS,
            data: mockData
        });
    });

    it('should catch Timeout error and assign 504 status', async () => {
        const error = new Error('Yêu cầu tới AI bị quá thời gian (Timeout).');
        CvBuilderService.checkAtsMatch.mockRejectedValue(error);

        await CvBuilderController.checkAtsMatch(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 504,
            message: MESSAGES.AI_SUGGESTION_TIMEOUT
        }));
    });

    it('should catch parsing hallucinagion error and assign 400 status', async () => {
        const error = new Error('Dữ liệu trả về từ AI không đúng chuẩn (Lỗi phân mảnh dữ liệu). Vui lòng thử lại.');
        CvBuilderService.checkAtsMatch.mockRejectedValue(error);

        await CvBuilderController.checkAtsMatch(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: HTTP_STATUS.BAD_REQUEST
        }));
    });

    it('should catch generic error and assign 500 status', async () => {
        const error = new Error('Network error');
        CvBuilderService.checkAtsMatch.mockRejectedValue(error);

        await CvBuilderController.checkAtsMatch(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR
        }));
    });
});
