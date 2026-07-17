const SkillRepository = require('../repositories/SkillRepository');
const redisClient = require('../config/redis');

class SkillService {
    async getAllSkills() {
        const cacheKey = 'data:skills:all';
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const skills = await SkillRepository.findAllActive({
            attributes: ['skillId', 'name'],
            order: [['name', 'ASC']]
        });

        await redisClient.set(cacheKey, JSON.stringify(skills), 'EX', 86400); // Cache 24 hours
        return skills;
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

        const result = await SkillRepository.create({ name });
        await redisClient.del('data:skills:all');
        return result;
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

        const result = await SkillRepository.update(id, { name });
        await redisClient.del('data:skills:all');
        return result;
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
        const result = await SkillRepository.delete(id);
        await redisClient.del('data:skills:all');
        return result;
    }
}

module.exports = new SkillService();
