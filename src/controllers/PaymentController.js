const TransactionService = require('../services/TransactionService');
const HTTP_STATUS = require('../constant/statusCode');

class PaymentController {
    /**
     * Get transaction history
     * @route GET /api/v1/payments/history
     */
    async getHistory(req, res, next) {
        try {
            const userId = req.user.userId;
            const history = await TransactionService.getHistory(userId, req.query);

            return res.status(HTTP_STATUS.OK).json({
                message: 'Lấy lịch sử giao dịch thành công.',
                data: history
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentController();
