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

    /**
     * Cập nhật tin tuyển dụng (Employer)
     * @param {string} userId
     * @param {string} jobId
     * @param {Object} updateData
     */
    async updateJob(userId, jobId, updateData) {
        const { CompanyRepository } = require('../repositories');

        // Check job exists
        const job = await JobPostRepository.findById(jobId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Verify ownership
        const company = await CompanyRepository.findByUserId(userId);
        if (!company || company.companyId !== job.companyId) {
            const error = new Error('Bạn không có quyền chỉnh sửa tin này.');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Map data
        const dataToUpdate = {};
        if (updateData.title) dataToUpdate.title = updateData.title;
        if (updateData.description) dataToUpdate.description = updateData.description;
        if (updateData.requirements) dataToUpdate.requirements = updateData.requirements;
        if (updateData.category_id) dataToUpdate.categoryId = updateData.category_id;
        if (updateData.location_id) dataToUpdate.locationId = updateData.location_id;
        if (updateData.level_id) dataToUpdate.levelId = updateData.level_id;
        if (updateData.salary_min !== undefined) dataToUpdate.salaryMin = updateData.salary_min;
        if (updateData.salary_max !== undefined) dataToUpdate.salaryMax = updateData.salary_max;

        // Validation: Logic nghiệp vụ lương (kết hợp dữ liệu cũ và mới)
        const finalSalaryMin = dataToUpdate.salaryMin !== undefined ? dataToUpdate.salaryMin : job.salaryMin;
        const finalSalaryMax = dataToUpdate.salaryMax !== undefined ? dataToUpdate.salaryMax : job.salaryMax;

        if (finalSalaryMin !== null && finalSalaryMax !== null && finalSalaryMax < finalSalaryMin) {
            const error = new Error('Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const updatedJob = await JobPostRepository.update(jobId, dataToUpdate);
        return updatedJob;
    }
    /**
     * Xóa mềm tin tuyển dụng (Employer)
     * @param {string} userId
     * @param {string} jobId
     */
    async deleteJob(userId, jobId) {
        const { CompanyRepository } = require('../repositories');

        // Check job exists
        const job = await JobPostRepository.findById(jobId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Verify ownership
        const company = await CompanyRepository.findByUserId(userId);
        if (!company || company.companyId !== job.companyId) {
            const error = new Error('Bạn không có quyền xóa tin này.');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Soft delete
        await JobPostRepository.softDelete(jobId);
        return true;
    }
    /**
     * Cập nhật trạng thái tin (Employer) - Đóng/Mở
     * @param {string} userId
     * @param {string} jobId
     * @param {string} status
     */
    async updateJobStatus(userId, jobId, status) {
        const { CompanyRepository } = require('../repositories');

        // Check job exists
        const job = await JobPostRepository.findById(jobId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Verify ownership
        const company = await CompanyRepository.findByUserId(userId);
        if (!company || company.companyId !== job.companyId) {
            const error = new Error('Bạn không có quyền chỉnh sửa tin này.');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Logic Open/Close
        if (status === 'Active') {
            // Check usage: Only allow Active if expiredAt is valid
            if (!job.expiredAt || new Date(job.expiredAt) < new Date()) {
                const error = new Error('Tin tuyển dụng đã hết hạn. Vui lòng gia hạn thêm.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }
        }

        // Chỉ cho phép Employer chuyển qua lại Active <-> Closed
        // Không cho phép tự ý Active nếu đang Pending/Rejected/Draft (cần quy trình khác)
        if (['Draft', 'Pending', 'Rejected'].includes(job.status)) {
            // Tuy nhiên, logic đơn giản ở đây, giả sử tin đã từng được Active thì mới Closed được.
            // Nếu user muốn Active 1 tin Draft -> Phải thanh toán (API khác)
            // Nếu user muốn Active 1 tin Pending -> Phải đợi Admin duyệt
            // Ở đây chỉ hỗ trợ: Closed -> Active (nếu còn hạn) và Active -> Closed
            if (job.status !== 'Closed' && job.status !== 'Active') {
                const error = new Error(`Không thể chuyển trạng thái từ ${job.status} sang ${status}.`);
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }
        }

        const updatedJob = await JobPostRepository.updateStatus(jobId, status);
        return updatedJob;
    }

    /**
     * Lấy danh sách tin của Employer
     * @param {string} userId
     * @param {Object} query - { status }
     */
    async getMyJobs(userId, query) {
        const { CompanyRepository } = require('../repositories');

        // Check user has company
        const company = await CompanyRepository.findByUserId(userId);
        if (!company) {
            const error = new Error('Bạn chưa đăng ký thông tin nhà tuyển dụng.');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        const filters = {};
        if (query.status) {
            filters.status = query.status;
        }

        const jobs = await JobPostRepository.findByCompany(company.companyId, filters);
        return jobs;
    }

    /**
     * Lấy chi tiết tin của Employer
     * @param {string} userId
     * @param {string} jobId
     */
    async getMyJobDetail(userId, jobId) {
        const { CompanyRepository } = require('../repositories');

        // Check user has company
        const company = await CompanyRepository.findByUserId(userId);
        if (!company) {
            const error = new Error('Bạn chưa đăng ký thông tin nhà tuyển dụng.');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Get detail
        const job = await JobPostRepository.getDetail(jobId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Verify ownership
        if (job.companyId !== company.companyId) {
            const error = new Error('Bạn không có quyền xem tin này.');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        return job;
    }

    /**
     * Lấy danh sách tin chờ duyệt (Admin)
     * @param {Object} query - limit, page
     */
    async getPendingJobs(query) {
        // Reuse existing search or findByStatus logic
        // For simplicity, using findByStatus which we might need to enhance for pagination if strictly needed,
        // but let's check findByStatus implementation again.
        // It calls findAll with status.

        const jobs = await JobPostRepository.findByStatus('Pending', {
            order: [['created_at', 'ASC']] // Tin cũ lên trước để duyệt
        });
        return jobs;
    }

    /**
     * Duyệt tin tuyển dụng (Admin)
     * @param {string} jobId
     */
    async approveJob(jobId) {
        // Check exist
        const job = await JobPostRepository.findById(jobId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Check current status
        if (job.status !== 'Pending') {
            const error = new Error('Chỉ có thể duyệt tin đang ở trạng thái chờ duyệt (Pending).');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Update to Active
        return await JobPostRepository.updateStatus(jobId, 'Active');
    }

    /**
     * Từ chối tin tuyển dụng (Admin)
     * @param {string} jobId
     * @param {string} reason
     */
    async rejectJob(jobId, reason) {
        // Check exist
        const job = await JobPostRepository.findById(jobId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Check current status
        if (job.status !== 'Pending') {
            const error = new Error('Chỉ có thể từ chối tin đang ở trạng thái chờ duyệt (Pending).');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Update to Rejected with reason
        // Note: Assuming we don't increment "Edit Count" here, user will edit later which might increment it.
        // Or if we need to track how many times rejected, we might need a separate field 'rejectionCount'.
        // For now, adhering to simple updateStatus flow.

        return await JobPostRepository.updateStatus(jobId, 'Rejected', reason);
    }

    /**
     * Lấy tất cả tin tuyển dụng (Admin)
     * @param {Object} query - limit, page, status, companyId, keyword
     */
    async getAllJobs(query) {
        const { status, companyId, keyword, limit, page } = query;
        const filters = { status, companyId, keyword };

        const options = {};
        if (limit) options.limit = parseInt(limit);
        if (page && limit) options.offset = (parseInt(page) - 1) * parseInt(limit);

        return await JobPostRepository.getAllJobs(filters, options);
    }
}

module.exports = new JobService();
