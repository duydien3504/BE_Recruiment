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

    async findAllUsers(filters, options = {}) {
        const { Role } = require('../models');
        const where = { isDeleted: false };

        const roleInclude = {
            model: Role,
            as: 'role',
            attributes: ['roleName']
        };

        if (filters.keyword) {
            where[Op.or] = [
                { fullName: { [Op.like]: `%${filters.keyword}%` } },
                { email: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        if (filters.role) {
            // Database roles are stored in uppercase (ADMIN, CANDIDATE, EMPLOYER)
            roleInclude.where = { roleName: filters.role.toUpperCase() };
        }

        if (filters.status) {
            where.status = filters.status;
        }

        return await this.findAll(where, { ...options, include: [roleInclude] });
    }
    async countWithRole(roleName, conditions = {}) {
        const { Role } = require('../models');
        return await this.model.count({
            where: conditions,
            include: [{
                model: Role,
                as: 'role',
                where: { roleName: roleName.toUpperCase() }
            }]
        });
    }
}

module.exports = new UserRepository();
