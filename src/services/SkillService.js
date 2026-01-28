const SkillRepository = require('../repositories/SkillRepository');

class SkillService {
    async getAllSkills() {
        return await SkillRepository.findAllActive({
            attributes: ['skillId', 'name'],
            order: [['name', 'ASC']]
        });
    }

    async createSkill(data) {
        const { name } = data;
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const exists = await SkillRepository.findByName(name);
        if (exists) {
            const error = new Error('Kỹ năng này đã tồn tại.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        return await SkillRepository.create({ name });
    }

    async updateSkill(id, data) {
        const { name } = data;
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const skill = await SkillRepository.findById(id);
        if (!skill) {
            const error = new Error(MESSAGES.SKILL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (name && name !== skill.name) {
            const exists = await SkillRepository.findByName(name);
            if (exists && exists.skillId != id) {
                const error = new Error('Tên kỹ năng đã tồn tại.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }
        }

        return await SkillRepository.update(id, { name });
    }

    async deleteSkill(id) {
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const skill = await SkillRepository.findById(id);
        if (!skill) {
            const error = new Error(MESSAGES.SKILL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Hard delete likely as Skill doesn't have isDeleted column based on model
        return await SkillRepository.delete(id);
    }
}

module.exports = new SkillService();
