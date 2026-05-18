const {
    JobPostRepository,
    TransactionRepository,
    CompanyRepository,
    UserRepository
} = require('../repositories');
const momoHelper = require('../utils/momoHelper');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const { sequelize } = require('../config/database');
const {
    TRANSACTION_TYPES,
    TRANSACTION_STATUSES,
    PAYMENT_METHODS,
    MOMO_RESULT_CODES
} = require('../constant/transactionConstants');
const { ROLES } = require('../constant/roles');

const USER_STATUS_ACTIVE = 'Active';
const COMPANY_STATUS_ACTIVE = 'Active';

class PaymentService {
    /**
     * Tạo link thanh toán MoMo
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
            paymentMethod: PAYMENT_METHODS.MOMO,
            transactionType: TRANSACTION_TYPES.JOB_POST,
            status: TRANSACTION_STATUSES.PENDING
        });

        // Create MoMo payment URL
        const paymentUrl = await momoHelper.createPaymentUrl({
            amount: amount,
            orderInfo: `ThanhToanTinTuyenDung${jobPostId}`,
            orderId: transaction.transactionId.toString()
        });

        return {
            paymentUrl,
            transactionId: transaction.transactionId,
            amount
        };
    }

    /**
     * Xử lý callback/IPN từ MoMo
     * @param {Object} momoParams - Data từ MoMo
     */
    async handleCallback(momoParams) {
        // Verify signature
        const { isValid, data } = momoHelper.verifySignature(momoParams);

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
        if (data.resultCode === MOMO_RESULT_CODES.SUCCESS) {
            await sequelize.transaction(async (databaseTransaction) => {
                await TransactionRepository.update(transaction.transactionId, {
                    status: TRANSACTION_STATUSES.SUCCESS,
                    transactionNo: data.transId,
                    bankCode: data.payType,
                    payDate: data.responseTime
                }, { transaction: databaseTransaction });

                if (transaction.transactionType === TRANSACTION_TYPES.JOB_POST && transaction.jobPostId) {
                    const expiredAt = new Date();
                    expiredAt.setDate(expiredAt.getDate() + 30);

                    await JobPostRepository.update(transaction.jobPostId, {
                        status: 'Active',
                        expiredAt: expiredAt
                    }, { transaction: databaseTransaction });
                }

                if (transaction.transactionType === TRANSACTION_TYPES.ACCOUNT_REGISTRATION) {
                    const company = await CompanyRepository.findById(transaction.companyId, { transaction: databaseTransaction });
                    if (!company) {
                        const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
                        error.status = HTTP_STATUS.NOT_FOUND;
                        throw error;
                    }

                    await CompanyRepository.updateStatus(company.companyId, COMPANY_STATUS_ACTIVE, { transaction: databaseTransaction });
                    await UserRepository.updateStatus(company.userId, USER_STATUS_ACTIVE, { transaction: databaseTransaction });
                }

                if (transaction.transactionType === TRANSACTION_TYPES.UPGRADE_EMPLOYER) {
                    const company = await CompanyRepository.findById(transaction.companyId, { transaction: databaseTransaction });
                    if (!company) {
                        const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
                        error.status = HTTP_STATUS.NOT_FOUND;
                        throw error;
                    }

                    await CompanyRepository.updateStatus(company.companyId, COMPANY_STATUS_ACTIVE, { transaction: databaseTransaction });
                    await UserRepository.update(company.userId, { roleId: ROLES.EMPLOYER }, { transaction: databaseTransaction });
                }
            });

            // ── Gửi thông báo tới toàn bộ Admin (fire-and-forget, không block) ──
            try {
                const { saveAndSendNotification } = require('./SocketService');
                const adminIds = await UserRepository.findAllAdminIds();

                if (adminIds.length > 0) {
                    let adminNotification = null;

                    if (transaction.transactionType === TRANSACTION_TYPES.JOB_POST) {
                        const job = await JobPostRepository.findById(transaction.jobPostId);
                        adminNotification = {
                            title: 'Tin tuyển dụng mới vừa được đăng',
                            message: `Tin "${job ? job.title : `#${transaction.jobPostId}`}" vừa được thanh toán và kích hoạt. Vui lòng kiểm duyệt.`,
                            type: 'NEW_JOB_POST',
                            jobPostId: transaction.jobPostId
                        };
                    } else if (transaction.transactionType === TRANSACTION_TYPES.ACCOUNT_REGISTRATION) {
                        const company = await CompanyRepository.findById(transaction.companyId);
                        adminNotification = {
                            title: 'Nhà tuyển dụng mới đăng ký',
                            message: `Công ty "${company ? company.name : `#${transaction.companyId}`}" vừa hoàn tất đăng ký tài khoản Employer. Vui lòng xác minh.`,
                            type: 'NEW_EMPLOYER_REGISTRATION',
                            companyId: transaction.companyId
                        };
                    } else if (transaction.transactionType === TRANSACTION_TYPES.UPGRADE_EMPLOYER) {
                        const company = await CompanyRepository.findById(transaction.companyId);
                        adminNotification = {
                            title: 'Tài khoản nâng cấp Employer thành công',
                            message: `Công ty "${company ? company.name : `#${transaction.companyId}`}" vừa nâng cấp lên tài khoản Employer. Vui lòng xác minh thông tin.`,
                            type: 'UPGRADE_EMPLOYER',
                            companyId: transaction.companyId
                        };
                    }

                    if (adminNotification) {
                        await Promise.all(
                            adminIds.map(adminId =>
                                saveAndSendNotification(adminId, 'new_notification', adminNotification)
                            )
                        );
                    }
                }
            } catch (notifErr) {
                // Không block luồng chính nếu notification lỗi
                console.error('[PaymentService] Admin notification error:', notifErr.message);
            }

            return {
                success: true,
                message: transaction.transactionType === TRANSACTION_TYPES.ACCOUNT_REGISTRATION
                    ? MESSAGES.EMPLOYER_ACCOUNT_ACTIVATED_SUCCESS
                    : transaction.transactionType === TRANSACTION_TYPES.UPGRADE_EMPLOYER
                        ? MESSAGES.UPGRADE_EMPLOYER_ACTIVATED_SUCCESS
                        : MESSAGES.PAYMENT_SUCCESS,
                jobPostId: transaction.jobPostId,
                transactionType: transaction.transactionType
            };
        } else {
            // Payment failed
            await TransactionRepository.update(transaction.transactionId, {
                status: TRANSACTION_STATUSES.FAILED,
                transactionNo: data.transId
            });

            // Handle retry logic for UPGRADE_EMPLOYER
            if (transaction.transactionType === TRANSACTION_TYPES.UPGRADE_EMPLOYER) {
                const MAX_UPGRADE_PAYMENT_RETRIES = 3;
                const failedCount = await TransactionRepository.countFailedByCompanyAndType(
                    transaction.companyId,
                    TRANSACTION_TYPES.UPGRADE_EMPLOYER
                );

                if (failedCount >= MAX_UPGRADE_PAYMENT_RETRIES) {
                    await CompanyRepository.softDelete(transaction.companyId);
                }
            }

            return {
                success: false,
                message: MESSAGES.PAYMENT_FAILED
            };
        }
    }
}

module.exports = new PaymentService();
