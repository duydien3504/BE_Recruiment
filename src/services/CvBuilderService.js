const { CvBuilderRepository, UserRepository, CvTemplateRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class CvBuilderService {
    /**
     * Lấy bản nháp CV của user. Nếu chưa tồn tại sẽ tự động tạo mới với default.
     * Complexity: O(1) — lookup và insert theo userId (primary key / indexed FK).
     * @param {string} userId
     * @returns {Promise<object>}
     */
    async getCvDraft(userId) {
        // O(1): tìm theo indexed userId column
        let cvBuilder = await CvBuilderRepository.findByUserId(userId);

        // Nếu chưa có bản nháp nào → tự động sinh bản mặc định (first-time init)
        if (!cvBuilder) {
            cvBuilder = await CvBuilderRepository.createDefault(userId);
        }

        return this._formatResponse(cvBuilder);
    }

    /**
     * Format dữ liệu trả về theo chuẩn Response Body của endpoint.
     * @param {object} cvBuilder - Sequelize model instance
     * @returns {object}
     */
    _formatResponse(cvBuilder) {
        return {
            id: cvBuilder.id,
            templateId: cvBuilder.templateId,
            themeConfig: cvBuilder.themeConfig,
            cvData: cvBuilder.cvData,
            atsScore: cvBuilder.atsScore,
            version: cvBuilder.version
        };
    }

    /**
     * Cập nhật bản nháp CV: Kích hoạt AtsScorer.calculateScore() lên cvData,
     * và update record dựa theo ID của user.
     * Sử dụng Optimistic Locking (version) để chống chồng lấn dữ liệu.
     * Complexity: O(n) cho việc scan cvData + O(1) query Indexed FK
     * @param {string} userId 
     * @param {object} payload - { cvData, themeConfig, templateId, version }
     * @returns {Promise<object>} - { newAtsScore, newVersion }
     */
    async updateCvDraft(userId, payload) {
        // Upsert pattern: nếu user chưa có draft thì tạo mặc định trước, rồi update
        let cvBuilder = await CvBuilderRepository.findByUserId(userId);
        console.log('[CvBuilderService] findByUserId result:', cvBuilder ? `Found id=${cvBuilder.id}` : 'NOT FOUND');

        if (!cvBuilder) {
            cvBuilder = await CvBuilderRepository.createDefault(userId);
            console.log('[CvBuilderService] createDefault result:', cvBuilder ? `Created id=${cvBuilder.id}` : 'CREATE FAILED');
        }

        if (!cvBuilder || !cvBuilder.id) {
            const error = new Error('Không thể khởi tạo bản nháp CV.');
            error.status = 500;
            throw error;
        }

        // Validate templateId gửi lên có tồn tại trong DB không
        if (payload.templateId) {
            const template = await CvTemplateRepository.findActiveById(payload.templateId);
            if (!template) {
                const error = new Error('Template không tồn tại hoặc đã bị vô hiệu hóa.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }
        }

        // Chấm điểm O(n) dựa trên Object Node
        const AtsScorer = require('../utils/AtsScorer');
        const newAtsScore = AtsScorer.calculateScore(payload.cvData);

        // Gom toàn bộ data vào cvData để đảm bảo không rớt mục nào (học vấn, kinh nghiệm, dự án...)
        // Dù frontend gửi các mục ở top-level hay bên trong cvData thì đều gộp chung lại
        const rawCvData = { ...payload };
        delete rawCvData.templateId;
        delete rawCvData.themeConfig;
        delete rawCvData.columnLayout;
        delete rawCvData.version;
        delete rawCvData.cvData;

        const finalCvData = {
            ...cvBuilder.cvData,      // Giữ lại dữ liệu hiện tại trong DB
            ...rawCvData,             // Ghi đè các trường top-level mới
            ...(payload.cvData || {}) // Ghi đè các trường trong object cvData
        };

        // Map data để update đè — đảm bảo lưu columnLayout
        const updateData = {
            templateId: payload.templateId,
            themeConfig: payload.themeConfig,
            columnLayout: payload.columnLayout,
            cvData: finalCvData,
            atsScore: newAtsScore
        };

        console.log('[CvBuilderService] Updating draft id:', cvBuilder.id);

        // ── Optimistic Locking: kiểm tra version trước khi cập nhật ──
        // Nếu client gửi lên version → dùng updateDraftWithVersion để kiểm tra xung đột
        if (payload.version !== undefined && payload.version !== null) {
            const updated = await CvBuilderRepository.updateDraftWithVersion(
                cvBuilder.id, updateData, payload.version
            );

            if (!updated) {
                const error = new Error(MESSAGES.CV_BUILDER_VERSION_CONFLICT);
                error.status = HTTP_STATUS.CONFLICT;
                throw error;
            }

            return { newAtsScore, newVersion: updated.version };
        }

        // Fallback: client không gửi version → backward-compatible (Last Write Wins)
        const updatedFallback = await CvBuilderRepository.updateDraft(cvBuilder.id, updateData);

        return { newAtsScore, newVersion: updatedFallback.version };
    }
    /**
     * Auto-fill profile data for CV
     * O(1) query by indexed ID + O(K) mapping skills array
     * @param {string} userId 
     * @returns {Promise<object>} auto-filled cvData fragment
     */
    async autoFillProfile(userId) {
        const user = await UserRepository.findWithSkills(userId);
        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND || 'Không tìm thấy dữ liệu người dùng.');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        return {
            personal: {
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                avatarUrl: user.avatarUrl || ''
            },
            about: user.bio || '',
            skills: user.skills ? user.skills.map(s => s.name) : []
        };
    }

    /**
     * Lấy danh sách template từ Database (thay thế file Constant cũ).
     * Hỗ trợ filter theo category (ngành nghề).
     * Complexity: O(n) với n = số template active.
     * @param {string|null} category
     * @returns {Promise<Array>}
     */
    async getTemplates(category = null) {
        const templates = await CvTemplateRepository.findAllActive(category);
        return templates;
    }

    /**
     * Khởi tạo quá trình gọi tới LLM để sinh nội dung gợi ý chuyên nghiệp
     * @param {object} payload - { industry, section, currentText, keyword }
     * @returns {Promise<Array<string>>}
     */
    async generateAiSuggestion(payload) {
        const OpenRouterService = require('../utils/OpenRouterService');
        const { industry, section, currentText, keyword } = payload;

        const infoSource = currentText ? `Thông tin người dùng đang viết: "${currentText}"` : (keyword ? `Từ khoá: "${keyword}"` : "Hãy tạo một số thông tin giả định sát với thực tế.");
        
        const prompt = `Bạn là một chuyên gia về nhân sự và thiết kế CV chuyên nghiệp (Resume Writer).
Nhiệm vụ: Viết 3 đến 5 gạch đầu dòng (bullet points) cực kì chuyên nghiệp và gây ấn tượng mạnh cho phần "${section}" của CV, áp dụng cho ngành nghề/vị trí "${industry}".
Kết quả nên được viết bằng tiếng Việt, MỘT CÁCH CHI TIẾT TỪ 20 ĐẾN 40 TỪ MỖI DÒNG, sử dụng các động từ chỉ hành động ở đầu câu (e.g. Quản lý, Thiết kế, Tối ưu hóa, Triển khai) và nên bổ sung thêm các số liệu, tính huống, hoặc công nghệ cụ thể (STAR method) để câu cú dài dặn như 1 đoạn văn ngắn, có chiều sâu thay vì chỉ liệt kê lại thông tin.
${infoSource}

YÊU CẦU ĐẦU RA:
- Chỉ trả về duy nhất nội dung các gạch đầu dòng.
- Không dùng Markdown liệt kê (không dùng dấu * , - hay số thứ tự ở đầu dòng). Mỗi câu nằm trên một dòng riêng biệt.
- KHÔNG BAO GIỜ TRẢ LỜI KIỂU: "Vâng, sau đây là...", "Tuyệt vời...", "Dưới đây là gợi ý...".`;

        try {
            const resultText = await OpenRouterService.generateText(prompt, 18000); // 18 seconds timeout
            
            // Xử lý cắt chuỗi text thành chuỗi mảng các gợi ý
            const suggestions = resultText
                .split('\n')
                .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim()) // Cleanup nếu AI cố tình trả markdown dạng list
                .filter(line => line.length > 5);

            return suggestions;
        } catch (error) {
            throw error; // Let controller handle HTTP Throw
        }
    }

    /**
     * Đánh giá độ khớp ATS dựa trên nội dung CV và JD
     * @param {string} cvText 
     * @param {string} jdText 
     * @returns {Promise<object>}
     */
    async checkAtsMatch(cvText, jdText) {
        const OpenRouterService = require('../utils/OpenRouterService');
        
        const prompt = `Bạn là một hệ thống chấm điểm hồ sơ tự động ATS (Applicant Tracking System).
Hãy phân tích nội dung toàn bộ CV của ứng viên đang có và so sánh với văn bản Mô tả công việc (JD) dưới đây.

[Nội dung JD]:
${jdText}

[Nội dung CV]:
${cvText}

Nhiệm vụ của bạn là chấm điểm mức độ phù hợp của CV với JD (thang điểm từ 0 đến 100), phân tích tìm ra các từ khóa kỹ năng cứng/mềm quan trọng trong JD mà ứng viên đang thiếu sót, và đưa ra một vài lời khuyên ngắn gọn để nâng cấp CV.
BẮT BUỘC chỉ trả về bằng JSON nguyên gốc theo đúng Document Schema sau, không chèn thêm bất kỳ văn bản nào khác bên ngoài JSON:
{
  "matchPercentage": 35,
  "missingKeywords": ["từ khoá 1", "từ khoá 2"],
  "recommendations": ["lời khuyên 1", "lời khuyên 2"]
}`;

        try {
            // Yêu cầu mô hình LLM trả định dạng JSON mode
            const resultText = await OpenRouterService.generateText(prompt, 20000, {
                response_format: { type: "json_object" }
            });
            
            // Dọn dẹp ký tự thừa (```json ... ```) nếu mô hình không tuân thủ hoàn toàn json mode
            const cleanJsonString = resultText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            
            const parsedData = JSON.parse(cleanJsonString);

            return {
                matchPercentage: typeof parsedData.matchPercentage === 'number' ? parsedData.matchPercentage : 0,
                missingKeywords: Array.isArray(parsedData.missingKeywords) ? parsedData.missingKeywords : [],
                recommendations: Array.isArray(parsedData.recommendations) ? parsedData.recommendations : []
            };
        } catch (error) {
            // Fix parsing LLM hallucination
            if (error instanceof SyntaxError) {
                throw new Error('Dữ liệu trả về từ AI không đúng chuẩn (Lỗi phân mảnh dữ liệu). Vui lòng thử lại.');
            }
            throw error;
        }
    }

    /**
     * Xuất HTML xem trước của CV
     * @param {string} userId 
     * @param {object} payload 
     * @returns {Promise<string>}
     */
    async getPreviewHtml(userId, payload = {}) {
        let { cvData, themeConfig, columnLayout, templateId } = payload;

        const cvBuilder = await CvBuilderRepository.findByUserId(userId);
        if (!cvBuilder) {
            const error = new Error('Không tìm thấy bản CV đang soạn.');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        cvData = cvData || cvBuilder.cvData;
        themeConfig = themeConfig || cvBuilder.themeConfig;
        columnLayout = columnLayout || cvBuilder.columnLayout;
        templateId = templateId || cvBuilder.templateId;

        let ejsPath = null;
        if (templateId) {
            const template = await CvTemplateRepository.findActiveById(templateId);
            if (template && template.ejsPath) {
                ejsPath = template.ejsPath;
            }
        }

        const PdfExportService = require('../utils/PdfExportService');
        return await PdfExportService.renderHtml(cvData, themeConfig, columnLayout, ejsPath);
    }

    /**
     * Xuất bản CV nháp của User ra PDF Format.
     * Sử dụng cơ chế Cache dựa trên Version: nếu CV chưa thay đổi kể từ lần
     * xuất gần nhất, trả về URL Cloudinary đã lưu thay vì render lại.
     * Bảo mật IDOR: userId luôn lấy từ JWT, không từ client.
     * @param {string} userId 
     * @param {object} payload - { cvData, themeConfig, templateId }
     * @returns {Promise<object>} - { type: 'url'|'buffer', url?, buffer? }
     */
    async exportCvDraft(userId, payload = {}) {
        // Luôn lấy bản nháp từ DB để có version + cache info chính xác nhất
        const cvBuilder = await CvBuilderRepository.findByUserId(userId);
        if (!cvBuilder) {
            const error = new Error('Không tìm thấy bản CV đang soạn nào trong hệ thống, hãy khởi tạo trước.');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // ── Cache Hit: version khớp → trả URL Cloudinary (tải nhanh, không tốn CPU) ──
        if (
            cvBuilder.pdfUrl &&
            cvBuilder.lastPdfVersion !== null &&
            cvBuilder.version === cvBuilder.lastPdfVersion
        ) {
            console.log('[ExportCV] Cache HIT — trả về URL Cloudinary đã lưu.');
            return { type: 'url', url: cvBuilder.pdfUrl };
        }

        // ── Cache Miss: cần render PDF mới ──
        console.log('[ExportCV] Cache MISS — bắt đầu render PDF mới...');

        let cvData = payload.cvData || cvBuilder.cvData;
        let themeConfig = payload.themeConfig || cvBuilder.themeConfig;
        let columnLayout = payload.columnLayout || cvBuilder.columnLayout || {
            left: ['profile', 'contact', 'about', 'skills'],
            right: ['experience', 'education', 'projects', 'awards']
        };
        let templateId = payload.templateId || cvBuilder.templateId;

        // Tra cứu đường dẫn file EJS từ bảng cv_templates theo templateId
        let ejsPath = null;
        if (templateId) {
            const template = await CvTemplateRepository.findActiveById(templateId);
            if (template && template.ejsPath) {
                ejsPath = template.ejsPath;
            }
        }

        const PdfExportService = require('../utils/PdfExportService');
        let pdfBuffer;

        try {
            pdfBuffer = await PdfExportService.generatePdf(cvData, themeConfig, columnLayout, ejsPath);
        } catch (error) {
            console.error('[Export CV Pipeline Error]:', error);
            throw new Error('Đã xảy ra lỗi trong quá trình kết xuất PDF bằng render engine. (Server Out Of Memory)');
        }

        // ── Fire-and-forget: đẩy upload Cloudinary vào background worker ──
        // User nhận file PDF ngay lập tức, Worker xử lý upload + retry ngầm
        const PdfCacheWorker = require('../utils/PdfCacheWorker');
        PdfCacheWorker.enqueue(pdfBuffer, userId, cvBuilder.id, cvBuilder.version);

        return { type: 'buffer', buffer: pdfBuffer };
    }
}

module.exports = new CvBuilderService();
