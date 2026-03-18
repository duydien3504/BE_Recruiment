const BaseRepository = require('./BaseRepository');
const { InterviewQuestion } = require('../models');

class InterviewQuestionRepository extends BaseRepository {
    constructor() {
        super(InterviewQuestion);
    }

    async deleteByApplicationId(applicationId, transaction = null) {
        return await this.model.destroy({
            where: { applicationId },
            transaction
        });
    }

    async bulkCreateQuestions(questions, transaction = null) {
        return await this.model.bulkCreate(questions, { transaction });
    }

    async findByApplicationId(applicationId) {
        return await this.findAll({ applicationId }, {
            order: [['created_at', 'ASC']]
        });
    }
}

module.exports = new InterviewQuestionRepository();
