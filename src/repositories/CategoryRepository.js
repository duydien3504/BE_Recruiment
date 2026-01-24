const BaseRepository = require('./BaseRepository');
const { Category } = require('../models');

class CategoryRepository extends BaseRepository {
    constructor() {
        super(Category);
    }

    async findByName(name) {
        return await this.findOne({ name, isDeleted: false });
    }

    async findAllActive(options = {}) {
        return await this.findAll({ isDeleted: false }, options);
    }
}

module.exports = new CategoryRepository();
