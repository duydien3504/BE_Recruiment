const BaseRepository = require('./BaseRepository');
const { Transaction } = require('../models');

class TransactionRepository extends BaseRepository {
    constructor() {
        super(Transaction);
    }

    async findByCompany(companyId, options = {}) {
        return await this.findAll({ companyId }, options);
    }

    async findByJobPost(jobPostId) {
        return await this.findOne({ jobPostId });
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status }, options);
    }

    async updateStatus(transactionId, status, options = {}) {
        return await this.update(transactionId, { status }, options);
    }
}

module.exports = new TransactionRepository();
