const BaseRepository = require('./BaseRepository');
const { User } = require('../models');
const { Op } = require('sequelize');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.findOne({ email });
    }

    async findByRole(roleId, options = {}) {
        return await this.findAll({ roleId, isDeleted: false }, options);
    }

    async findActiveUsers(options = {}) {
        return await this.findAll({ status: 'Active', isDeleted: false }, options);
    }

    async searchByName(keyword, options = {}) {
        return await this.findAll({
            fullName: { [Op.like]: `%${keyword}%` },
            isDeleted: false
        }, options);
    }

    async updateStatus(userId, status) {
        return await this.update(userId, { status });
    }
}

module.exports = new UserRepository();
