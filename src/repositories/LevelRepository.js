const BaseRepository = require('./BaseRepository');
const { Level } = require('../models');

class LevelRepository extends BaseRepository {
    constructor() {
        super(Level);
    }

    /**
     * Find level by name
     * Complexity: O(1) with index on name column
     * @param {string} name - Level name
     * @returns {Promise<Level|null>}
     */
    async findByName(name) {
        return await this.findOne({ name });
    }

    /**
     * Find all active levels (not deleted)
     * Complexity: O(n) where n = number of levels (typically small)
     * @param {Object} options - Query options
     * @returns {Promise<Level[]>}
     */
    async findAllActive(options = {}) {
        return await this.findAll({}, {
            order: [['name', 'ASC']],
            ...options
        });
    }
}

module.exports = new LevelRepository();
