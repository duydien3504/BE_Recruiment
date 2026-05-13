const BaseRepository = require('./BaseRepository');
const { CvBuilder } = require('../models');

const CV_BUILDER_ATTRIBUTES = ['id', 'userId', 'templateId', 'themeConfig', 'columnLayout', 'cvData', 'atsScore', 'version', 'pdfUrl', 'lastPdfVersion', 'created_at', 'updated_at'];

class CvBuilderRepository extends BaseRepository {
    constructor() {
        super(CvBuilder);
    }

    /**
     * Tìm bản nháp CV theo userId — O(1) via indexed userId column.
     * @param {string} userId
     * @returns {Promise<CvBuilder|null>}
     */
    async findByUserId(userId) {
        return await this.findOne(
            { userId },
            { attributes: CV_BUILDER_ATTRIBUTES }
        );
    }

    /**
     * Tạo bản nháp CV mới với giá trị mặc định.
     * @param {string} userId
     * @returns {Promise<CvBuilder>}
     */
    async createDefault(userId) {
        return await this.create({ userId });
    }

    /**
     * Cập nhật bản nháp CV theo id bản ghi.
     * @param {string} id
     * @param {object} payload
     * @returns {Promise<CvBuilder|null>}
     */
    async updateDraft(id, payload) {
        return await this.update(id, payload);
    }

    /**
     * Cập nhật bản nháp CV với kiểm tra Optimistic Locking (version).
     * Nếu version không khớp (đã có người khác lưu trước), trả về null.
     * @param {string} id - ID bản ghi CV
     * @param {object} payload - Dữ liệu cập nhật
     * @param {number} expectedVersion - Version mà client đang giữ
     * @returns {Promise<CvBuilder|null>} - null nếu version conflict
     */
    async updateDraftWithVersion(id, payload, expectedVersion) {
        const record = await this.findById(id);
        if (!record) return null;

        // Kiểm tra version trước khi cập nhật
        if (record.version !== expectedVersion) {
            return null; // Version conflict — có người khác đã lưu trước
        }

        // Sequelize với version: true sẽ tự động tăng version khi gọi update
        return await record.update(payload);
    }

    /**
     * Cập nhật cache PDF sau khi upload Cloudinary thành công.
     * Lưu URL mới và version tại thời điểm xuất PDF.
     * @param {string} id - ID bản ghi CV
     * @param {string} pdfUrl - URL file PDF trên Cloudinary
     * @param {number} pdfVersion - Version tại thời điểm xuất PDF
     * @returns {Promise<CvBuilder|null>}
     */
    async updatePdfCache(id, pdfUrl, pdfVersion) {
        return await this.update(id, {
            pdfUrl: pdfUrl,
            lastPdfVersion: pdfVersion
        });
    }
}

module.exports = new CvBuilderRepository();

