const BaseRepository = require('./BaseRepository');
const { Interview } = require('../models');
const { Op } = require('sequelize');

class InterviewRepository extends BaseRepository {
    constructor() {
        super(Interview);
    }

    async findByApplication(applicationId) {
        return await this.findOne({ applicationId, isDeleted: false });
    }

    async findUpcoming(options = {}) {
        return await this.findAll({
            interviewTime: { [Op.gt]: new Date() },
            status: 'Scheduled',
            isDeleted: false
        }, options);
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status, isDeleted: false }, options);
    }

    async updateStatus(interviewId, status) {
        return await this.update(interviewId, { status });
    }
}

module.exports = new InterviewRepository();
