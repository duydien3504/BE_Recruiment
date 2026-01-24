const BaseRepository = require('./BaseRepository');
const { Resume } = require('../models');

class ResumeRepository extends BaseRepository {
    constructor() {
        super(Resume);
    }

    async findByUser(userId, options = {}) {
        return await this.findAll({ userId, isDeleted: false }, options);
    }

    async findMainResume(userId) {
        return await this.findOne({ userId, isMain: true, isDeleted: false });
    }

    async setMainResume(resumesId, userId) {
        await this.model.update(
            { isMain: false },
            { where: { userId, isDeleted: false } }
        );
        return await this.update(resumesId, { isMain: true });
    }

    async countByUser(userId) {
        return await this.count({ userId, isDeleted: false });
    }
}

module.exports = new ResumeRepository();
