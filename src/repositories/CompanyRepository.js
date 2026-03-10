const BaseRepository = require('./BaseRepository');
const { Company } = require('../models');
const { Op } = require('sequelize');

class CompanyRepository extends BaseRepository {
    constructor() {
        super(Company);
    }

    async findByUserId(userId) {
        return await this.findOne({ userId });
    }

    async findByTaxCode(taxCode) {
        return await this.findOne({ taxCode, isDeleted: false });
    }

    async searchByName(keyword, options = {}) {
        return await this.findAll({
            name: { [Op.iLike]: `%${keyword}%` },
            isDeleted: false
        }, options);
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status, isDeleted: false }, options);
    }

    async updateStatus(companyId, status) {
        return await this.update(companyId, { status });
    }

    async getDetail(companyId) {
        return await this.findById(companyId, {
            include: [{
                model: require('../models').JobPost,
                as: 'jobPosts',
                where: { isDeleted: false, status: 'Active' },
                required: false // LEFT JOIN
            }]
        });
    }

    async getCompanies(filter) {
        const { keyword, page, limit } = filter;
        const offset = (page - 1) * limit;

        const where = {
            isDeleted: false,
            status: 'Active'
        };

        if (keyword) {
            where.name = { [Op.iLike]: `%${keyword}%` };
        }

        return await this.findAndCountAll(where, {
            limit,
            offset,
            order: [['created_at', 'DESC']],
            attributes: [
                'companyId',
                'userId',
                'name',
                'logoUrl',
                'scale',
                'description',
                'addressDetail',
                'status',
                ['created_at', 'createdAt']
            ]
        });
    }
}

module.exports = new CompanyRepository();
