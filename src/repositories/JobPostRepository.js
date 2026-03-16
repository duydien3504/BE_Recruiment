const BaseRepository = require('./BaseRepository');
const { JobPost } = require('../models');
const { Op } = require('sequelize');

class JobPostRepository extends BaseRepository {
    constructor() {
        super(JobPost);
    }

    async findByCompany(companyId, filters = {}, options = {}) {
        const where = { companyId, isDeleted: false };
        if (filters.status) {
            where.status = filters.status;
        }
        return await this.findAll(where, {
            ...options,
            order: [['created_at', 'DESC']]
        });
    }

    async countByCompanyId(companyId) {
        return await this.count({ companyId, isDeleted: false });
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status, isDeleted: false }, options);
    }

    async search(filters = {}, options = {}) {
        const where = {
            isDeleted: false,
            status: 'Active' // Public search -> Active only
        };

        if (filters.keyword) {
            where.title = { [Op.iLike]: `%${filters.keyword}%` };
        }
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.locationId) {
            where.locationId = filters.locationId;
        }

        return await this.findAndCountAll(where, {
            ...options,
            include: [
                {
                    model: require('../models').Company,
                    as: 'company',
                    attributes: ['companyId', 'name', 'logoUrl']
                },
                {
                    model: require('../models').Location,
                    as: 'location',
                    attributes: ['name']
                }
            ],
            order: [['created_at', 'DESC']]
        });
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

    async findActiveJobsByCompany(companyId, options = {}) {
        return await this.findAll({
            companyId,
            status: 'Active',
            isDeleted: false
        }, options);
    }

    async getDetail(jobPostId) {
        return await this.findById(jobPostId, {
            include: [
                { model: require('../models').Company, as: 'company' },
                { model: require('../models').Location, as: 'location', attributes: ['name'] },
                { model: require('../models').Category, as: 'category', attributes: ['name'] },
                { model: require('../models').Level, as: 'level', attributes: ['name'] },
                { model: require('../models').Skill, as: 'skills', through: { attributes: [] } }
            ]
        });
    }

    async getAllJobs(filters = {}, options = {}) {
        const where = { isDeleted: false };

        if (filters.status) where.status = filters.status;
        if (filters.companyId) where.companyId = filters.companyId;
        if (filters.keyword) where.title = { [Op.iLike]: `%${filters.keyword}%` };

        return await this.findAndCountAll(where, {
            ...options,
            include: [
                {
                    model: require('../models').Company,
                    as: 'company',
                    attributes: ['companyId', 'name']
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }
}

module.exports = new JobPostRepository();
