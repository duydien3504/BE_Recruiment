const BaseRepository = require('./BaseRepository');
const { User, Skill } = require('../models');
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

    async findWithSkills(userId) {
        return await this.findById(userId, {
            include: [{
                model: Skill,
                as: 'skills',
                through: { attributes: [] },
                attributes: ['skillId', 'name']
            }]
        });
    }

    async addSkills(userId, skillIds) {
        const user = await this.findById(userId);
        if (!user) return false;

        // Sử dụng mixin method do Sequelize tạo ra
        await user.addSkills(skillIds);
        return true;
    }

    async removeSkill(userId, skillId) {
        const user = await this.findById(userId);
        if (!user) return false;

        // Sử dụng mixin method do Sequelize tạo ra
        await user.removeSkill(skillId);
        return true;
    }
}

module.exports = new UserRepository();
