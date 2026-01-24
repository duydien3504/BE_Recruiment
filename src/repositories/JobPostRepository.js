const BaseRepository = require('./BaseRepository');
const { JobPost } = require('../models');
const { Op } = require('sequelize');

class JobPostRepository extends BaseRepository {
    constructor() {
        super(JobPost);
    }

    async findByCompany(companyId, options = {}) {
        return await this.findAll({ companyId, isDeleted: false }, options);
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status, isDeleted: false }, options);
    }

    async search(filters = {}, options = {}) {
        const where = { isDeleted: false };

        if (filters.keyword) {
            where.title = { [Op.like]: `%${filters.keyword}%` };
        }
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.locationId) {
            where.locationId = filters.locationId;
        }
        if (filters.status) {
            where.status = filters.status;
        }

        return await this.findAll(where, options);
    }

    async updateStatus(jobPostId, status, rejectionReason = null) {
        const updateData = { status };
        if (rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }
        return await this.update(jobPostId, updateData);
    }

    async incrementEditCount(jobPostId) {
        const job = await this.findById(jobPostId);
        if (job) {
            return await job.update({ editCount: job.editCount + 1 });
        }
        return null;
    }
}

module.exports = new JobPostRepository();
