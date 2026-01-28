const { TransactionRepository, CompanyRepository } = require('../repositories');
const HTTP_STATUS = require('../constant/statusCode');

class TransactionService {
    /**
     * Get transaction history for employer
     * @param {string} userId
     * @param {object} query - page, limit
     */
    async getHistory(userId, query) {
        const { page = 1, limit = 20 } = query;

        // Find company
        const company = await CompanyRepository.findByUserId(userId);
        if (!company) {
            const error = new Error('Bạn không có công ty nào.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const options = {
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        };

        return await TransactionRepository.findByCompany(company.companyId, options);
    }
}

module.exports = new TransactionService();
