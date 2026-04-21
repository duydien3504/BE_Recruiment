const BaseRepository = require('./BaseRepository');
const { CvBuilder } = require('../models');

const CV_BUILDER_ATTRIBUTES = ['id', 'userId', 'templateId', 'themeConfig', 'cvData', 'atsScore', 'created_at', 'updated_at'];

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
}

module.exports = new CvBuilderRepository();
