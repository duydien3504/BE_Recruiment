const BaseRepository = require('./BaseRepository');
const { JobSkill } = require('../models');

class JobSkillRepository extends BaseRepository {
    constructor() {
        super(JobSkill);
    }

    async findByJobPost(jobPostId) {
        return await this.findAll({ jobPostId });
    }

    async findBySkill(skillId) {
        return await this.findAll({ skillId });
    }

    async addSkillsToJob(jobPostId, skillIds) {
        const data = skillIds.map(skillId => ({ jobPostId, skillId }));
        return await this.bulkCreate(data);
    }

    async removeSkillsFromJob(jobPostId) {
        return await this.model.destroy({ where: { jobPostId } });
    }
}

module.exports = new JobSkillRepository();
