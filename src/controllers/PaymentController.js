const TransactionService = require('../services/TransactionService');
const PaymentService = require('../services/PaymentService');
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

    /**
     * Handle payment callback from VNPay
     * @route GET /api/v1/payments/callback
     */
    async handleCallback(req, res, next) {
        try {
            const result = await PaymentService.handleCallback(req.query);

            if (result.success) {
                // Redirect user to success page or return JSON
                // For now, redirect to frontend success page
                const transformUrl = process.env.CLIENT_URL || 'http://localhost:3000';
                res.redirect(`${transformUrl}/payment/success?jobId=${result.jobPostId}`);
            } else {
                const transformUrl = process.env.CLIENT_URL || 'http://localhost:3000';
                res.redirect(`${transformUrl}/payment/failed`);
            }
        } catch (error) {
            console.error('Payment Callback Error:', error);
            const transformUrl = process.env.CLIENT_URL || 'http://localhost:3000';
            res.redirect(`${transformUrl}/payment/failed?error=${encodeURIComponent(error.message)}`);
        }
    }

    /**
     * Handle payment callback for IPN (Instant Payment Notification)
     * @route GET /api/v1/payments/ipn
     */
    async handleIPN(req, res) {
        try {
            const result = await PaymentService.handleCallback(req.query);
            if (result.success) {
                res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            } else {
                res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
            }
        } catch (error) {
            res.status(200).json({ RspCode: '99', Message: 'Unknow error' });
        }
    }

    /**
     * Create payment URL
     * @route POST /api/v1/payments/create-payment
     */
    async createPayment(req, res, next) {
        try {
            const { jobPostId } = req.body;
            const userId = req.user.userId;
            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            const result = await PaymentService.createPayment({
                jobPostId,
                userId,
                ipAddr
            });

            return res.status(HTTP_STATUS.OK).json({
                message: 'Tạo URL thanh toán thành công.',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentController();
