const PaymentService = require('../services/PaymentService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class PaymentController {
    /**
     * Tạo link thanh toán
     * @route POST /api/v1/payments/create
     */
    async createPayment(req, res, next) {
        try {
            const userId = req.user.userId;
            const { jobPostId } = req.body;
            let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
            // Convert IPv6 localhost to IPv4
            if (ipAddr === '::1') ipAddr = '127.0.0.1';

            const result = await PaymentService.createPayment({
                jobPostId,
                userId,
                ipAddr
            });

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.CREATE_PAYMENT_SUCCESS,
                paymentUrl: result.paymentUrl,
                transactionId: result.transactionId,
                amount: result.amount
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Callback từ VNPay
     * @route GET /api/v1/payments/callback
     */
    async handleCallback(req, res, next) {
        try {
            const vnpParams = req.query;
            const result = await PaymentService.handleCallback(vnpParams);

            if (result.success) {
                // Redirect to success page (Frontend)
                return res.redirect(`http://localhost:3000/payment/success?jobId=${result.jobPostId}`);
            } else {
                // Redirect to failure page
                return res.redirect('http://localhost:3000/payment/failure');
            }
        } catch (error) {
            next(error);
        }
    }

    /**
     * Test payment success (Development only)
     * @route POST /api/v1/payments/test-success
     */
    async testPaymentSuccess(req, res, next) {
        try {
            const { transactionId } = req.body;
            const { TransactionRepository, JobPostRepository } = require('../repositories');

            // Get transaction
            const transaction = await TransactionRepository.findById(transactionId);
            if (!transaction) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Không tìm thấy giao dịch.'
                });
            }

            // Update transaction to success
            await TransactionRepository.update(transaction.transactionId, {
                status: 'Success',
                transactionNo: 'TEST' + Date.now(),
                bankCode: 'NCB',
                payDate: new Date().toISOString()
            });

            // Update job to Active
            const expiredAt = new Date();
            expiredAt.setDate(expiredAt.getDate() + 30);

            await JobPostRepository.update(transaction.jobPostId, {
                status: 'Active',
                expiredAt: expiredAt
            });

            return res.status(HTTP_STATUS.OK).json({
                message: 'Test payment thành công. Job đã được kích hoạt.',
                data: {
                    jobPostId: transaction.jobPostId,
                    status: 'Active',
                    expiredAt
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentController();
