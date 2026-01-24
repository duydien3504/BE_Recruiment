const BaseRepository = require('./BaseRepository');
const { Company } = require('../models');
const { Op } = require('sequelize');

class CompanyRepository extends BaseRepository {
    constructor() {
        super(Company);
    }

    async findByUserId(userId) {
        return await this.findOne({ userId, isDeleted: false });
    }

    async findByTaxCode(taxCode) {
        return await this.findOne({ taxCode, isDeleted: false });
    }

    async searchByName(keyword, options = {}) {
        return await this.findAll({
            name: { [Op.like]: `%${keyword}%` },
            isDeleted: false
        }, options);
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status, isDeleted: false }, options);
    }

    async updateStatus(companyId, status) {
        return await this.update(companyId, { status });
    }
}

module.exports = new CompanyRepository();
