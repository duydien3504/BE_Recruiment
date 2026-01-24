const BaseRepository = require('./BaseRepository');
const { Skill } = require('../models');

class SkillRepository extends BaseRepository {
    constructor() {
        super(Skill);
    }

    async findByName(name) {
        return await this.findOne({ name });
    }

    async findAllActive(options = {}) {
        return await this.findAll({}, options);
    }

    async findByIds(skillIds) {
        return await this.model.findAll({
            where: { skillId: skillIds }
        });
    }
}

module.exports = new SkillRepository();
