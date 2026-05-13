const CvBuilderService = require('../../src/services/CvBuilderService');
const { CvBuilderRepository, CvTemplateRepository } = require('../../src/repositories');
const PdfExportService = require('../../src/utils/PdfExportService');
const PdfCacheWorker = require('../../src/utils/PdfCacheWorker');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories');
jest.mock('../../src/utils/PdfExportService', () => ({
    generatePdf: jest.fn()
}));
jest.mock('../../src/utils/PdfCacheWorker', () => ({
    enqueue: jest.fn()
}));

describe('CvBuilderService.exportCvDraft', () => {
    const USER_ID = 'user-001';
    const MOCK_PDF_BUFFER = Buffer.from('mock pdf data');
    const MOCK_CLOUDINARY_URL = 'https://res.cloudinary.com/test/raw/upload/cv_builder_exports/cv_pdf_user-001_123.pdf';

    beforeEach(() => {
        jest.clearAllMocks();
        CvTemplateRepository.findActiveById = jest.fn().mockResolvedValue(null);
    });

    // ─── Cache HIT: version khớp → trả URL Cloudinary ──────────────────────

    test('should return cached Cloudinary URL when version matches lastPdfVersion (Cache HIT)', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue({
            id: 'cv-1',
            cvData: { personal: { fullName: 'Test' } },
            themeConfig: { primaryColor: '#000' },
            templateId: 'modern_it_01',
            version: 5,
            pdfUrl: MOCK_CLOUDINARY_URL,
            lastPdfVersion: 5 // Trùng với version → cache valid
        });

        const result = await CvBuilderService.exportCvDraft(USER_ID);

        expect(result).toEqual({ type: 'url', url: MOCK_CLOUDINARY_URL });
        // Không gọi PdfExportService vì dùng cache
        expect(PdfExportService.generatePdf).not.toHaveBeenCalled();
        expect(PdfCacheWorker.enqueue).not.toHaveBeenCalled();
    });

    // ─── Cache MISS: version lệch → render + fire-and-forget upload ────────

    test('should render PDF and enqueue background upload when version differs (Cache MISS)', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue({
            id: 'cv-1',
            cvData: { personal: { fullName: 'Test' } },
            themeConfig: { primaryColor: '#000' },
            templateId: 'modern_it_01',
            version: 6,
            pdfUrl: MOCK_CLOUDINARY_URL,
            lastPdfVersion: 5 // Lệch version → cache invalid
        });

        PdfExportService.generatePdf.mockResolvedValue(MOCK_PDF_BUFFER);

        const result = await CvBuilderService.exportCvDraft(USER_ID);

        expect(result).toEqual({ type: 'buffer', buffer: MOCK_PDF_BUFFER });
        expect(PdfExportService.generatePdf).toHaveBeenCalled();
        // Worker.enqueue được gọi với đúng tham số (Fire-and-forget)
        expect(PdfCacheWorker.enqueue).toHaveBeenCalledWith(
            MOCK_PDF_BUFFER,
            USER_ID,
            'cv-1',
            6
        );
    });

    // ─── Lần đầu export (chưa có cache) ────────────────────────────────────

    test('should render PDF when no cache exists (pdfUrl is null)', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue({
            id: 'cv-1',
            cvData: {},
            themeConfig: {},
            templateId: 'modern_it_01',
            version: 1,
            pdfUrl: null,        // Chưa có cache
            lastPdfVersion: null
        });

        PdfExportService.generatePdf.mockResolvedValue(MOCK_PDF_BUFFER);

        const result = await CvBuilderService.exportCvDraft(USER_ID);

        expect(result).toEqual({ type: 'buffer', buffer: MOCK_PDF_BUFFER });
        expect(PdfExportService.generatePdf).toHaveBeenCalled();
        expect(PdfCacheWorker.enqueue).toHaveBeenCalledWith(
            MOCK_PDF_BUFFER,
            USER_ID,
            'cv-1',
            1
        );
    });

    // ─── User nhận PDF ngay lập tức (Worker chạy ngầm, không chặn) ─────────

    test('should return PDF buffer immediately without waiting for Worker', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue({
            id: 'cv-1',
            cvData: {},
            themeConfig: {},
            templateId: null,
            version: 2,
            pdfUrl: null,
            lastPdfVersion: null
        });

        PdfExportService.generatePdf.mockResolvedValue(MOCK_PDF_BUFFER);

        const result = await CvBuilderService.exportCvDraft(USER_ID);

        // User nhận file ngay, không phải đợi upload
        expect(result).toEqual({ type: 'buffer', buffer: MOCK_PDF_BUFFER });
        // Worker đã được gọi nhưng không block hàm
        expect(PdfCacheWorker.enqueue).toHaveBeenCalledTimes(1);
    });

    // ─── CV không tồn tại → 404 ────────────────────────────────────────────

    test('should throw 404 NOT FOUND if cvBuilder draft does not exist', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue(null);

        await expect(CvBuilderService.exportCvDraft(USER_ID)).rejects.toMatchObject({
            status: HTTP_STATUS.NOT_FOUND,
            message: 'Không tìm thấy bản CV đang soạn nào trong hệ thống, hãy khởi tạo trước.'
        });

        expect(PdfExportService.generatePdf).not.toHaveBeenCalled();
    });

    // ─── Puppeteer crash → throw error (không catch) ───────────────────────

    test('should throw server error if PDF generation (Puppeteer) fails', async () => {
        CvBuilderRepository.findByUserId.mockResolvedValue({
            id: 'cv-1',
            cvData: {},
            themeConfig: {},
            templateId: null,
            version: 1,
            pdfUrl: null,
            lastPdfVersion: null
        });
        PdfExportService.generatePdf.mockRejectedValue(new Error('Puppeteer Crashed'));

        await expect(CvBuilderService.exportCvDraft(USER_ID)).rejects.toThrow(
            'Đã xảy ra lỗi trong quá trình kết xuất PDF bằng render engine. (Server Out Of Memory)'
        );

        // Worker không được gọi vì render đã thất bại
        expect(PdfCacheWorker.enqueue).not.toHaveBeenCalled();
    });
});
