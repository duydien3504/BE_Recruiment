const BaseRepository = require('./BaseRepository');
const { SavedJob } = require('../models');

class SavedJobRepository extends BaseRepository {
    constructor() {
        super(SavedJob);
    }

    async findByUser(userId, options = {}) {
        return await this.findAll({ userId }, options);
    }

    async checkSaved(userId, jobPostId) {
        return await this.findOne({ userId, jobPostId });
    }

    async saveJob(userId, jobPostId) {
        return await this.create({ userId, jobPostId });
    }

    async unsaveJob(userId, jobPostId) {
        return await this.model.destroy({ where: { userId, jobPostId } });
    }
}

module.exports = new SavedJobRepository();
