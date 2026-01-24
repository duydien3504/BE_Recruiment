const BaseRepository = require('./BaseRepository');
const { Application } = require('../models');

class ApplicationRepository extends BaseRepository {
    constructor() {
        super(Application);
    }

    async findByJobPost(jobPostId, options = {}) {
        return await this.findAll({ jobPostId }, options);
    }

    async findByUser(userId, options = {}) {
        return await this.findAll({ userId }, options);
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status }, options);
    }

    async updateStatus(applicationId, status, employerNote = null) {
        const updateData = { status };
        if (employerNote) {
            updateData.employerNote = employerNote;
        }
        return await this.update(applicationId, updateData);
    }

    async checkExistingApplication(userId, jobPostId) {
        return await this.findOne({ userId, jobPostId });
    }
}

module.exports = new ApplicationRepository();
