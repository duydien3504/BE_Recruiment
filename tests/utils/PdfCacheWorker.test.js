/**
 * Unit Tests cho PdfCacheWorker
 *
 * Kiểm tra cơ chế: Upload thành công, Retry khi lỗi, Dừng sau N lần thất bại.
 * Sử dụng Jest fake timers để không phải đợi setTimeout thật (5s, 10s...).
 */

const uploadService = require('../../src/utils/uploadService');
const { CvBuilderRepository } = require('../../src/repositories');

jest.mock('../../src/utils/uploadService', () => ({
    uploadToCloudinary: jest.fn()
}));
jest.mock('../../src/repositories', () => ({
    CvBuilderRepository: {
        updatePdfCache: jest.fn()
    }
}));

// Import SAU khi mock dependencies
const PdfCacheWorker = require('../../src/utils/PdfCacheWorker');

describe('PdfCacheWorker', () => {
    const MOCK_BUFFER = Buffer.from('test pdf content');
    const USER_ID = 'user-123';
    const CV_BUILDER_ID = 'cv-abc';
    const VERSION = 7;
    const MOCK_URL = 'https://res.cloudinary.com/demo/raw/upload/cv.pdf';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        // Spy on console methods to avoid noisy output and to assert calls
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    // ─── Happy Path: Upload thành công ngay lần đầu ────────────────────────

    test('should upload to Cloudinary and update DB cache on first attempt', async () => {
        uploadService.uploadToCloudinary.mockResolvedValue(MOCK_URL);
        CvBuilderRepository.updatePdfCache.mockResolvedValue({});

        // Gọi _processUpload trực tiếp (testable) thay vì enqueue
        await PdfCacheWorker._processUpload(MOCK_BUFFER, USER_ID, CV_BUILDER_ID, VERSION, 0);

        expect(uploadService.uploadToCloudinary).toHaveBeenCalledTimes(1);
        expect(uploadService.uploadToCloudinary).toHaveBeenCalledWith(
            MOCK_BUFFER,
            'cv_builder_exports',
            expect.objectContaining({
                resource_type: 'raw',
                format: 'pdf'
            })
        );

        expect(CvBuilderRepository.updatePdfCache).toHaveBeenCalledWith(
            CV_BUILDER_ID,
            MOCK_URL,
            VERSION
        );

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('Upload thành công')
        );
    });

    // ─── Retry: Lỗi lần 1, thành công lần 2 ───────────────────────────────

    test('should retry once and succeed on second attempt', async () => {
        uploadService.uploadToCloudinary
            .mockRejectedValueOnce(new Error('Cloudinary timeout'))
            .mockResolvedValueOnce(MOCK_URL);
        CvBuilderRepository.updatePdfCache.mockResolvedValue({});

        // Chạy _processUpload (nó sẽ dùng setTimeout nội bộ cho retry)
        const processPromise = PdfCacheWorker._processUpload(MOCK_BUFFER, USER_ID, CV_BUILDER_ID, VERSION, 0);

        // Chờ đến khi setTimeout được đặt, sau đó fast-forward qua delay
        await jest.advanceTimersByTimeAsync(5000);
        await processPromise;

        expect(uploadService.uploadToCloudinary).toHaveBeenCalledTimes(2);
        expect(CvBuilderRepository.updatePdfCache).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('Thử lại sau 5s')
        );
    });

    // ─── Retry: Lỗi 2 lần, thành công lần 3 ───────────────────────────────

    test('should retry twice and succeed on third attempt', async () => {
        uploadService.uploadToCloudinary
            .mockRejectedValueOnce(new Error('timeout 1'))
            .mockRejectedValueOnce(new Error('timeout 2'))
            .mockResolvedValueOnce(MOCK_URL);
        CvBuilderRepository.updatePdfCache.mockResolvedValue({});

        const processPromise = PdfCacheWorker._processUpload(MOCK_BUFFER, USER_ID, CV_BUILDER_ID, VERSION, 0);

        // Fast-forward qua delay lần 1 (5s)
        await jest.advanceTimersByTimeAsync(5000);
        // Fast-forward qua delay lần 2 (10s)
        await jest.advanceTimersByTimeAsync(10000);

        await processPromise;

        expect(uploadService.uploadToCloudinary).toHaveBeenCalledTimes(3);
        expect(CvBuilderRepository.updatePdfCache).toHaveBeenCalledTimes(1);
    });

    // ─── Thất bại hoàn toàn: 4 lần thử đều lỗi → log error, không crash ──

    test('should give up after MAX_RETRIES+1 attempts and log error', async () => {
        const mockError = new Error('Cloudinary is down');
        uploadService.uploadToCloudinary.mockRejectedValue(mockError);

        const processPromise = PdfCacheWorker._processUpload(MOCK_BUFFER, USER_ID, CV_BUILDER_ID, VERSION, 0);

        // Fast-forward qua tất cả delay (5s + 10s + 20s)
        await jest.advanceTimersByTimeAsync(5000);
        await jest.advanceTimersByTimeAsync(10000);
        await jest.advanceTimersByTimeAsync(20000);

        await processPromise;

        // Tổng cộng: 1 lần gốc + 3 lần retry = 4 lần gọi
        expect(uploadService.uploadToCloudinary).toHaveBeenCalledTimes(4);
        // DB cache KHÔNG được cập nhật vì tất cả đều thất bại
        expect(CvBuilderRepository.updatePdfCache).not.toHaveBeenCalled();
        // Log error cuối cùng báo cho Admin
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('FAILED sau 4 lần thử')
        );
    });

    // ─── enqueue() không throw dù Worker lỗi toàn bộ ──────────────────────

    test('enqueue() should not throw even if all retries fail', () => {
        uploadService.uploadToCloudinary.mockRejectedValue(new Error('total failure'));

        // enqueue() phải chạy mà không throw bất kỳ lỗi nào ra ngoài
        expect(() => {
            PdfCacheWorker.enqueue(MOCK_BUFFER, USER_ID, CV_BUILDER_ID, VERSION);
        }).not.toThrow();
    });

    // ─── enqueue() gọi _processUpload đúng tham số ─────────────────────────

    test('enqueue() should call _processUpload with correct arguments', () => {
        const spy = jest.spyOn(PdfCacheWorker, '_processUpload').mockResolvedValue();

        PdfCacheWorker.enqueue(MOCK_BUFFER, USER_ID, CV_BUILDER_ID, VERSION);

        expect(spy).toHaveBeenCalledWith(MOCK_BUFFER, USER_ID, CV_BUILDER_ID, VERSION, 0);
        spy.mockRestore();
    });
});
