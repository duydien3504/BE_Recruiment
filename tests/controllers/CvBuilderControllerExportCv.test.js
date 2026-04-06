const CvBuilderController = require('../../src/controllers/CvBuilderController');
const CvBuilderService = require('../../src/services/CvBuilderService');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/CvBuilderService');

describe('CvBuilderController.exportCvPdf', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { userId: 'user-1' }
        };
        res = {
            setHeader: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should export PDF successfully and attach proper headers', async () => {
        const fakeBuffer = Buffer.from('pdf data');
        CvBuilderService.exportCvDraft.mockResolvedValue(fakeBuffer);

        await CvBuilderController.exportCvPdf(req, res, next);

        expect(CvBuilderService.exportCvDraft).toHaveBeenCalledWith('user-1');
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
        expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=Resume-Export.pdf');
        expect(res.send).toHaveBeenCalledWith(fakeBuffer);
    });

    it('should call next with error if service throws', async () => {
        const fakeError = new Error('Out of RAM');
        CvBuilderService.exportCvDraft.mockRejectedValue(fakeError);

        await CvBuilderController.exportCvPdf(req, res, next);

        expect(next).toHaveBeenCalledWith(fakeError);
    });
});
