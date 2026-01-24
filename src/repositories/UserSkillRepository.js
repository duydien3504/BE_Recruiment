const BaseRepository = require('./BaseRepository');
const { UserSkill } = require('../models');

class UserSkillRepository extends BaseRepository {
    constructor() {
        super(UserSkill);
    }

    async findByUser(userId) {
        return await this.findAll({ userId });
    }

    async findBySkill(skillId) {
        return await this.findAll({ skillId });
    }

    async addSkillsToUser(userId, skillIds) {
        const data = skillIds.map(skillId => ({ userId, skillId }));
        return await this.bulkCreate(data);
    }

    async removeSkillsFromUser(userId) {
        return await this.model.destroy({ where: { userId } });
    }

    async removeSkillFromUser(userId, skillId) {
        return await this.model.destroy({ where: { userId, skillId } });
    }
}

module.exports = new UserSkillRepository();
