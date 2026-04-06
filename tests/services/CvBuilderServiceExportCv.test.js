const CvBuilderService = require('../../src/services/CvBuilderService');
const CvBuilderRepository = require('../../src/repositories/CvBuilderRepository');
const PdfExportService = require('../../src/utils/PdfExportService');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories/CvBuilderRepository');
jest.mock('../../src/utils/PdfExportService', () => ({
    generatePdf: jest.fn()
}));

describe('CvBuilderService.exportCvDraft', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should query cvBuilder, call PdfExportService and return Buffer successfully', async () => {
        const mockCvBuilder = {
            id: '123',
            cvData: { personal: { fullName: 'Test' } },
            themeConfig: { primaryColor: '#000' }
        };
        const mockPdfBuffer = Buffer.from('mock pdf stream data');

        CvBuilderRepository.findByUserId.mockResolvedValue(mockCvBuilder);
        PdfExportService.generatePdf.mockResolvedValue(mockPdfBuffer);

        const result = await CvBuilderService.exportCvDraft('user-1');

        expect(CvBuilderRepository.findByUserId).toHaveBeenCalledWith('user-1');
        expect(PdfExportService.generatePdf).toHaveBeenCalledWith(mockCvBuilder.cvData, mockCvBuilder.themeConfig);
        expect(result).toBe(mockPdfBuffer);
    });

    it('should throw 404 NOT FOUND if cvBuilder draft does not exist', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue(null);

        try {
            await CvBuilderService.exportCvDraft('user-1');
        } catch (error) {
            expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            expect(error.message).toBe('Không tìm thấy bản CV đang soạn nào trong hệ thống, hãy khởi tạo trước.');
        }

        expect(PdfExportService.generatePdf).not.toHaveBeenCalled();
    });

    it('should throw generic server error if PDF generation process fails (e.g., OOM)', async () => {
        const mockCvBuilder = {
            cvData: {},
            themeConfig: {}
        };
        CvBuilderRepository.findByUserId.mockResolvedValue(mockCvBuilder);
        PdfExportService.generatePdf.mockRejectedValue(new Error('Puppeteer Crashed'));

        try {
            await CvBuilderService.exportCvDraft('user-1');
        } catch (error) {
            expect(error.message).toBe('Đã xảy ra lỗi trong quá trình kết xuất PDF bằng render engine. (Server Out Of Memory)');
        }
    });
});
