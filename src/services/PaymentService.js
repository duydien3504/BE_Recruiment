const { JobPostRepository, TransactionRepository } = require('../repositories');
const vnpayHelper = require('../utils/vnpayHelper');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class PaymentService {
    /**
     * Tạo link thanh toán VNPay
     * @param {Object} params - { jobPostId, userId, ipAddr }
     */
    async createPayment(params) {
        const { jobPostId, userId, ipAddr } = params;

        // Verify job exists and belongs to user
        const job = await JobPostRepository.findById(jobPostId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Verify ownership through company
        const { CompanyRepository } = require('../repositories');
        const company = await CompanyRepository.findByUserId(userId);

        if (!company || company.companyId !== job.companyId) {
            const error = new Error('Bạn không có quyền thanh toán cho tin này.');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Check if already paid
        if (job.status === 'Active' || job.status === 'Pending') {
            const error = new Error('Tin tuyển dụng đã được thanh toán.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Create transaction record
        const amount = 10000; // 10,000 VND
        const transaction = await TransactionRepository.create({
            companyId: company.companyId,
            jobPostId: jobPostId,
            amount: amount,
            paymentMethod: 'VNPay',
            status: 'Pending'
        });

        // Create VNPay payment URL
        const paymentUrl = vnpayHelper.createPaymentUrl({
            amount: amount,
            orderInfo: `ThanhToanTinTuyenDung${jobPostId}`,
            orderId: transaction.transactionId.toString(),
            ipAddr: ipAddr
        });

        return {
            paymentUrl,
            transactionId: transaction.transactionId,
            amount
        };
    }

    /**
     * Xử lý callback từ VNPay
     * @param {Object} vnpParams - Query params từ VNPay
     */
    async handleCallback(vnpParams) {
        // Verify signature
        const { isValid, data } = vnpayHelper.verifyCallback(vnpParams);

        if (!isValid) {
            const error = new Error('Chữ ký không hợp lệ.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Get transaction
        const transaction = await TransactionRepository.findById(data.orderId);
        if (!transaction) {
            const error = new Error('Không tìm thấy giao dịch.');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Check response code
        if (data.responseCode === '00') {
            // Payment success
            await TransactionRepository.update(transaction.transactionId, {
                status: 'Success',
                transactionNo: data.transactionNo,
                bankCode: data.bankCode,
                payDate: data.payDate
            });

            // Update job status to Active and set expiredAt
            const expiredAt = new Date();
            expiredAt.setDate(expiredAt.getDate() + 30); // 30 ngày

            await JobPostRepository.update(transaction.jobPostId, {
                status: 'Active',
                expiredAt: expiredAt
            });

            return {
                success: true,
                message: MESSAGES.PAYMENT_SUCCESS,
                jobPostId: transaction.jobPostId
            };
        } else {
            // Payment failed
            await TransactionRepository.update(transaction.transactionId, {
                status: 'Failed',
                transactionNo: data.transactionNo
            });

            return {
                success: false,
                message: MESSAGES.PAYMENT_FAILED
            };
        }
    }
}

module.exports = new PaymentService();
