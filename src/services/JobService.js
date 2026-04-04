const { JobPostRepository, ResumeRepository, UserRepository } = require('../repositories');
const AIService = require('./AIService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const {
    TRANSACTION_TYPES,
    TRANSACTION_STATUSES,
    PAYMENT_METHODS
} = require('../constant/transactionConstants');
const axios = require('axios');
const pdf = require('pdf-parse');
const cloudinary = require('../config/cloudinary');

class JobService {
    // ... (rest of methods)

    /**
     * Gợi ý việc làm AI (Candidate)
     * @param {string} userId
     */
    async getSuggestedJobs(userId) {
        // 1. Get User Data first
        const user = await UserRepository.findWithSkills(userId);
        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const candidateSkills = user.skills ? user.skills.map(s => s.name) : [];
        const candidateTitle = user.title || '';

        // 2. Get Main Resume
        const resume = await ResumeRepository.findMainResume(userId);

        let resumeText = '';
        if (resume && resume.fileUrl) {
            try {
                let downloadUrl = resume.fileUrl;

                // If it's a Cloudinary URL, use a signed URL to avoid 401/403 for raw assets
                if (downloadUrl.includes('cloudinary.com')) {
                    console.log(`[JobService] Cloudinary URL detected. Generating signed download link...`);
                    // Pattern to match Cloudinary URL and extract parts
                    // https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/v<version>/<public_id_with_extension>
                    const match = downloadUrl.match(/res\.cloudinary\.com\/[^/]+\/([^/]+)\/upload\/(?:v\d+\/)?(.+)$/);
                    if (match) {
                        const resourceType = match[1]; // e.g., 'raw' or 'image'
                        const publicIdWithExt = match[2]; // e.g., 'resumes/abc.pdf'

                        // Extract extension
                        const lastDotIndex = publicIdWithExt.lastIndexOf('.');
                        const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
                        const extension = lastDotIndex !== -1 ? publicIdWithExt.substring(lastDotIndex + 1) : '';

                        downloadUrl = cloudinary.utils.private_download_url(publicIdWithExt, extension, {
                            resource_type: resourceType,
                            type: 'upload'
                        });
                        console.log(`[JobService] Signed URL generated: ${downloadUrl.substring(0, 100)}...`);
                    }
                }

                console.log(`[JobService] Attempting to read CV from: ${downloadUrl.substring(0, 80)}...`);

                const response = await axios({
                    method: 'get',
                    url: downloadUrl,
                    responseType: 'arraybuffer',
                    timeout: 10000,
                    headers: {
                        'Accept': 'application/pdf',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });

                const buffer = Buffer.from(response.data);

                // 3. Parse PDF to Text
                const data = await pdf(buffer);
                resumeText = data.text;

                if (resumeText.length > 5000) {
                    resumeText = resumeText.substring(0, 5000);
                }
                console.log(`[JobService] CV read successfully (${resumeText.length} chars).`);
            } catch (pdfError) {
                console.error(`[JobService] CV Read Error: ${pdfError.message}`);

                if (pdfError.response && (pdfError.response.status === 401 || pdfError.response.status === 403)) {
                    console.error('[JobService] Access Denied. Cloudinary signed URL might have failed or account has strict private settings.');
                }

                // Non-critical error: Proceed to fallback if skills exist
                console.log('[JobService] Falling back to profile skills due to read error.');
            }
        }

        // Final check: Need either resumeText or profile skills
        if (!resumeText && candidateSkills.length === 0) {
            const msg = resume
                ? 'Không thể đọc nội dung file CV của bạn và bạn cũng chưa cập nhật kỹ năng trong hồ sơ. Vui lòng tải lên lại (Upload mới) CV hoặc cập nhật bộ kỹ năng trong hồ sơ cá nhân.'
                : 'Bạn cần tải lên CV hoặc cập nhật kỹ năng trong hồ sơ cá nhân để sử dụng tính năng gợi ý việc làm.';
            const error = new Error(msg);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // 3. Get Active Jobs
        const { rows: jobs } = await JobPostRepository.search({}, { limit: 50 });

        if (jobs.length === 0) {
            return { data: [] };
        }

        // 4. Call AI Service
        try {
            if (resumeText) {
                return await AIService.getSuggestionsWithResume(resumeText, jobs);
            } else {
                return await AIService.getSuggestions({ title: candidateTitle, skills: candidateSkills }, jobs);
            }
        } catch (error) {
            console.error('[JobService] AI Error:', error.message);
            return { data: [] };
        }
    }

    /**
     * Tìm kiếm việc làm (Public)
     * @param {Object} query - query params
     * @returns {Object} { data, pagination }
     */
    async getJobs(query) {
        const { keyword, category_id, location_id, job_type, experience_required, page = 1, limit = 10 } = query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        const filters = {
            keyword,
            categoryId: category_id,
            locationId: location_id,
            jobType: job_type,
            experienceRequired: experience_required
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
            jobType: jobData.job_type || 'fulltime',
            experienceRequired: jobData.experience_required || null,
            quantity: jobData.quantity || 1,
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
            paymentMethod: PAYMENT_METHODS.VNPAY,
            transactionType: TRANSACTION_TYPES.JOB_POST,
            status: TRANSACTION_STATUSES.PENDING
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
        if (updateData.job_type) dataToUpdate.jobType = updateData.job_type;
        if (updateData.experience_required !== undefined) dataToUpdate.experienceRequired = updateData.experience_required;
        if (updateData.quantity !== undefined) dataToUpdate.quantity = updateData.quantity;
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
