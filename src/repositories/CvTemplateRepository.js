const BaseRepository = require('./BaseRepository');
const { CvTemplate } = require('../models');

class CvTemplateRepository extends BaseRepository {
    constructor() {
        super(CvTemplate);
    }

    /**
     * Lấy tất cả template đang active, có hỗ trợ filter theo category.
     * Sắp xếp theo category để FE nhóm hiển thị.
     * Complexity: O(n) scan với n = số template active.
     * @param {string|null} category - Tên category để filter, null = lấy tất cả.
     * @returns {Promise<CvTemplate[]>}
     */
    async findAllActive(category = null) {
        const conditions = { isActive: true };
        if (category) {
            conditions.category = category;
        }
        return await this.findAll(conditions, {
            order: [['category', 'ASC'], ['name', 'ASC']]
        });
    }

    /**
     * Tìm template theo ID và trả về nếu đang active.
     * Dùng để validate templateId khi user auto-save bản nháp.
     * @param {string} id - Template ID (Ví dụ: 'modern_it_01')
     * @returns {Promise<CvTemplate|null>}
     */
    async findActiveById(id) {
        return await this.findOne({ id, isActive: true });
    }
}

module.exports = new CvTemplateRepository();
