const CvBuilderController = require('../../src/controllers/CvBuilderController');
const CvBuilderService = require('../../src/services/CvBuilderService');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/CvBuilderService');

describe('CvBuilderController.exportCvPdf', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { userId: 'user-1' },
            body: {}
        };
        res = {
            setHeader: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    // ─── Cache MISS: trả PDF buffer trực tiếp ──────────────────────────────

    it('should stream PDF buffer with correct headers when cache misses', async () => {
        const fakeBuffer = Buffer.from('pdf data');
        CvBuilderService.exportCvDraft.mockResolvedValue({ type: 'buffer', buffer: fakeBuffer });

        await CvBuilderController.exportCvPdf(req, res, next);

        expect(CvBuilderService.exportCvDraft).toHaveBeenCalledWith('user-1', {});
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
        expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=Resume-Export.pdf');
        expect(res.send).toHaveBeenCalledWith(fakeBuffer);
    });

    // ─── Cache HIT: trả URL Cloudinary ──────────────────────────────────────

    it('should return downloadUrl JSON when cache hits', async () => {
        const fakeUrl = 'https://res.cloudinary.com/demo/raw/upload/cv.pdf';
        CvBuilderService.exportCvDraft.mockResolvedValue({ type: 'url', url: fakeUrl });

        await CvBuilderController.exportCvPdf(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            downloadUrl: fakeUrl
        }));
        // Không gọi setHeader Content-Type PDF khi trả JSON
        expect(res.setHeader).not.toHaveBeenCalled();
    });

    // ─── Service lỗi → chuyển về error handler ──────────────────────────────

    it('should call next with error if service throws', async () => {
        const fakeError = new Error('Out of RAM');
        CvBuilderService.exportCvDraft.mockRejectedValue(fakeError);

        await CvBuilderController.exportCvPdf(req, res, next);

        expect(next).toHaveBeenCalledWith(fakeError);
    });
});
