const uploadService = require('./uploadService');
const { CvBuilderRepository } = require('../repositories');

/**
 * PdfCacheWorker — In-memory Async Worker
 *
 * Xử lý upload PDF lên Cloudinary theo kiểu Fire-and-forget (không chặn luồng chính).
 * Tích hợp cơ chế Retry với Exponential Backoff: thử tối đa MAX_RETRIES lần,
 * mỗi lần cách nhau RETRY_DELAYS[retryCount] mili‑giây.
 *
 * Nếu tất cả các lần thử đều thất bại → ghi Error Log cho Admin và giải phóng Buffer
 * để Garbage Collector thu dọn bộ nhớ (Memory Leak Prevention).
 */
class PdfCacheWorker {
    constructor() {
        /** Số lần thử tối đa (lần đầu + 3 lần retry = tổng cộng 4 lần gọi) */
        this.MAX_RETRIES = 3;

        /** Thời gian chờ giữa mỗi lần retry (ms): 30s → 1 phút (60s) → 2 phút (120s) */
        this.RETRY_DELAYS = [60000, 120000, 180000];
    }

    /**
     * Đẩy công việc Upload PDF lên Cloudinary vào background.
     * Hàm này KHÔNG trả về Promise (Fire-and-forget) nên caller
     * KHÔNG ĐƯỢC dùng `await` khi gọi.
     *
     * @param {Buffer} pdfBuffer - Nội dung file PDF đã render
     * @param {string} userId - ID người dùng (dùng cho public_id trên Cloudinary)
     * @param {string} cvBuilderId - ID bản ghi cv_builders trong DB
     * @param {number} version - Phiên bản CV tại thời điểm render
     */
    enqueue(pdfBuffer, userId, cvBuilderId, version) {
        // Gọi hàm async nhưng KHÔNG await → chạy ngầm trên Event Loop
        this._processUpload(pdfBuffer, userId, cvBuilderId, version, 0)
            .catch(() => {
                // Safety net: đảm bảo không có unhandled rejection nào thoát ra ngoài
            });
    }

    /**
     * Logic xử lý Upload thực tế với cơ chế Retry đệ quy.
     * @private
     */
    async _processUpload(pdfBuffer, userId, cvBuilderId, version, retryCount) {
        try {
            console.log(`[PdfCacheWorker] Uploading PDF to Cloudinary (attempt ${retryCount + 1}/${this.MAX_RETRIES + 1})...`);

            const pdfUrl = await uploadService.uploadToCloudinary(pdfBuffer, 'cv_builder_exports', {
                resource_type: 'raw',
                public_id: `cv_pdf_${userId}_${Date.now()}`,
                format: 'pdf'
            });

            // Upload thành công → cập nhật DB cache
            await CvBuilderRepository.updatePdfCache(cvBuilderId, pdfUrl, version);
            console.log(`[PdfCacheWorker] Upload thành công & cache đã cập nhật (version=${version}).`);

            // ── Memory Leak Prevention: giải phóng tham chiếu Buffer ──
            pdfBuffer = null;

        } catch (error) {
            if (retryCount < this.MAX_RETRIES) {
                const delay = this.RETRY_DELAYS[retryCount] || 20000;
                console.warn(
                    `[PdfCacheWorker] Upload thất bại (attempt ${retryCount + 1}/${this.MAX_RETRIES + 1}): ${error.message}. ` +
                    `Thử lại sau ${delay / 1000}s...`
                );

                // Đệ quy retry sau khoảng delay
                await new Promise(resolve => setTimeout(resolve, delay));
                return this._processUpload(pdfBuffer, userId, cvBuilderId, version, retryCount + 1);
            }

            // ── Hết lượt retry: báo log mức cao cho Admin ──
            console.error(
                `[PdfCacheWorker] FAILED sau ${this.MAX_RETRIES + 1} lần thử. ` +
                `userId=${userId}, cvBuilderId=${cvBuilderId}, version=${version}. ` +
                `Lỗi cuối: ${error.message}`
            );

            // ── Memory Leak Prevention: giải phóng Buffer dù thất bại ──
            pdfBuffer = null;
        }
    }
}

module.exports = new PdfCacheWorker();
