const { JobPostRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class JobService {
    /**
     * Tìm kiếm việc làm (Public)
     * @param {Object} query - query params
     * @returns {Object} { data, pagination }
     */
    async getJobs(query) {
        const { keyword, category_id, location_id, page = 1, limit = 10 } = query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        const filters = {
            keyword,
            categoryId: category_id,
            locationId: location_id
        };

        const { count, rows } = await JobPostRepository.search(filters, {
            limit: limitNum,
            offset
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum)
            }
        };
    }

    /**
     * Xem chi tiết việc làm
     * @param {string} jobId
     * @param {string} userId - User ID (optional)
     */
    async getJobDetail(jobId, userId) {
        const job = await JobPostRepository.getDetail(jobId);

        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const jobData = job.toJSON();

        // Ẩn lương nếu user chưa đăng nhập
        if (!userId) {
            jobData.salaryMin = null;
            jobData.salaryMax = null;
            jobData.isHiddenSalary = true;
            jobData.salaryDisplay = 'Đăng nhập để xem';
        }

        return jobData;
    }

    /**
     * Tạo tin tuyển dụng (Employer)
     * @param {string} userId
     * @param {Object} jobData
     * @param {string} ipAddr - IP address for VNPay
     */
    async createJob(userId, jobData, ipAddr) {
        const { CompanyRepository, TransactionRepository } = require('../repositories');
        const vnpayHelper = require('../utils/vnpayHelper');

        // Verify user has company
        const company = await CompanyRepository.findByUserId(userId);
        if (!company) {
            const error = new Error('Bạn cần đăng ký làm nhà tuyển dụng trước.');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Map request data
        const newJob = {
            companyId: company.companyId,
            categoryId: jobData.category_id,
            locationId: jobData.location_id,
            levelId: jobData.level_id || null,
            title: jobData.title,
            description: jobData.description,
            requirements: jobData.requirements || '',
            salaryMin: jobData.salary_min || null,
            salaryMax: jobData.salary_max || null,
            status: 'Draft', // Chờ thanh toán
            expiredAt: null // Sẽ set sau khi thanh toán
        };

        const job = await JobPostRepository.create(newJob);

        // Tự động tạo transaction và payment URL
        const amount = 10000; // 10,000 VND
        const transaction = await TransactionRepository.create({
            companyId: company.companyId,
            jobPostId: job.jobPostId,
            amount: amount,
            paymentMethod: 'VNPay',
            status: 'Pending'
        });

        // Tạo VNPay payment URL
        const paymentUrl = vnpayHelper.createPaymentUrl({
            amount: amount,
            orderInfo: `ThanhToanTinTuyenDung${job.jobPostId}`,
            orderId: transaction.transactionId.toString(),
            ipAddr: ipAddr
        });

        return {
            job,
            paymentUrl,
            transactionId: transaction.transactionId,
            amount
        };
    }
}

module.exports = new JobService();
