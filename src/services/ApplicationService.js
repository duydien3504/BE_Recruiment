const {
    ApplicationRepository,
    JobPostRepository,
    ResumeRepository,
    CompanyRepository
} = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const { PAGINATION_DEFAULTS } = require('../constant/applicationConstants');
const axios = require('axios');


class ApplicationService {
    /**
     * Create application
     * @param {string} userId
     * @param {object} data
     */
    async createApplication(userId, data) {
        const { jobPostId, resumesId, coverLetter } = data;

        // 1. Check if job exists
        const job = await JobPostRepository.findById(jobPostId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Check if resume exists and belongs to user
        const resume = await ResumeRepository.findById(resumesId);
        if (!resume) {
            const error = new Error(MESSAGES.RESUME_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (resume.userId !== userId) {
            const error = new Error(MESSAGES.OWNER_RESUME_REQUIRED);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // 3. Check if already applied
        const existing = await ApplicationRepository.checkExistingApplication(userId, jobPostId);
        if (existing) {
            const error = new Error(MESSAGES.ALREADY_APPLIED);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // 4. Create application
        const applicationData = {
            userId,
            jobPostId,
            resumesId,
            coverLetter,
            status: 'Pending'
        };

        const newApplication = await ApplicationRepository.create(applicationData);

        // 5. Notification: Send to Employer
        try {
            const { User } = require('../models');
            // Get Employer User ID from Job -> Company -> User
            // Job is already fetched in step 1. job.companyId
            // Need to fetch company to get userId
            const { CompanyRepository } = require('../repositories');
            const company = await CompanyRepository.findById(job.companyId);

            if (company && company.userId) {
                const { saveAndSendNotification } = require('./SocketService');
                const applicant = await require('../repositories/UserRepository').findById(userId);
                const applicantName = applicant ? applicant.fullName : 'Ứng viên';

                const notificationData = {
                    title: 'Có ứng viên mới!',
                    message: `Có ứng viên mới ${applicantName} vừa ứng tuyển vào tin ${job.title}.`,
                    type: 'APPLICATION',
                    jobId: job.jobPostId,
                    applicationId: newApplication.applicationId
                };

                await saveAndSendNotification(company.userId, 'new_notification', notificationData);
            }
        } catch (err) {
            console.error('Socket Notification Error (Create Application):', err.message);
            // Non-blocking error
        }

        return newApplication;
    }

    /**
     * Get candidate applications
     * @param {string} userId
     */
    async getCandidateApplications(userId) {
        return await ApplicationRepository.findByUser(userId);
    }

    /**
     * Lấy danh sách hồ sơ ứng tuyển của Candidate có phân trang + filter theo status.
     *
     * Complexity:
     *   - Repository dùng findAndCountAll với WHERE + LIMIT/OFFSET: O(log n) via DB index.
     *   - Map DTO: O(n) single-pass, n = số records trả về (luôn <= limit).
     *   - Tổng cộng: O(log n) — không có nested loop.
     *
     * @param {string} userId
     * @param {object} queryParams
     * @param {string}  [queryParams.status]  - Filter status (optional)
     * @param {number}  queryParams.page       - Trang hiện tại (đã validated, >= 1)
     * @param {number}  queryParams.limit      - Số record/trang (đã validated, >= 1)
     * @returns {Promise<{applications: object[], pagination: object}>}
     */
    async getMyApplications(userId, { status, page, limit }) {
        const offset = (page - PAGINATION_DEFAULTS.PAGE) * limit;

        const { count, rows } = await ApplicationRepository.findAndCountByUserId(userId, {
            status,
            limit,
            offset
        });

        // Map sang flat DTO — O(n), n <= limit
        const applications = rows.map(app => ({
            applicationId: app.applicationId,
            jobPostId:     app.jobPostId,
            jobTitle:      app.jobPost ? app.jobPost.title : null,
            companyName:   app.jobPost?.company ? app.jobPost.company.name : null,
            coverLetter:   app.coverLetter,
            status:        app.status,
            appliedAt:     app.createdAt
        }));

        const totalPages = Math.ceil(count / limit);

        return {
            applications,
            pagination: {
                currentPage:  page,
                totalPages,
                totalItems:   count,
                limit
            }
        };
    }

    /**
     * Cancel (delete) an application by Candidate.
     *
     * Nghiệp vụ:
     *   1. Tìm application theo (applicationId, userId, status='Pending') — O(1) PK lookup.
     *   2. Nếu không tìm thấy → kiểm tra xem có tồn tại application không (phân biệt 404 vs 400).
     *   3. Nếu application tồn tại nhưng status != Pending → 400 (đã bị Employer tác động).
     *   4. Nếu không tồn tại hoặc không thuộc userId → 404 (ẩn thông tin security).
     *   5. Xóa bản ghi.
     *
     * Complexity: O(1) — tất cả query đều dùng PK index.
     *
     * @param {number} applicationId
     * @param {string} userId  - Lấy từ JWT, đảm bảo chỉ xóa của chính mình
     */
    async cancelApplication(applicationId, userId) {
        // Bước 1: Tìm application thuộc userId và đang Pending (O(1) - PK + FK indexed)
        const pendingApplication = await ApplicationRepository.findPendingByIdAndUserId(
            applicationId,
            userId
        );

        if (!pendingApplication) {
            // Bước 2: Phân biệt 404 (không tồn tại / không phải của mình) vs 400 (đã bị tác động)
            // Tra thêm bằng PK để xác định lý do cụ thể, vẫn là O(1)
            const existingApplication = await ApplicationRepository.findOne(
                { applicationId, userId },
                { attributes: ['applicationId', 'status'] }
            );

            if (!existingApplication) {
                // Không tìm thấy hoặc không thuộc về user này → 404
                const notFoundError = new Error(MESSAGES.APPLICATION_NOT_FOUND);
                notFoundError.status = HTTP_STATUS.NOT_FOUND;
                throw notFoundError;
            }

            // Tìm thấy nhưng status != Pending → Employer đã tác động → 400
            const cannotCancelError = new Error(MESSAGES.APPLICATION_CANNOT_BE_CANCELLED);
            cannotCancelError.status = HTTP_STATUS.BAD_REQUEST;
            throw cannotCancelError;
        }

        // Bước 3: Xóa bản ghi — O(1) via PK
        await ApplicationRepository.deleteById(applicationId);
    }

    /**
     * Get application detail
     * @param {string} userId
     * @param {number} applicationId
     */
    async getApplicationDetail(userId, applicationId) {
        const application = await ApplicationRepository.findDetailById(applicationId);

        if (!application) {
            const error = new Error(MESSAGES.APPLICATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (application.userId !== userId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        return application;
    }

    /**
     * Get applications for a job (Employer)
     * @param {string} userId - Employer User ID
     * @param {number} jobId
     */
    async getJobApplications(userId, jobId) {
        // 1. Check job exists
        const job = await JobPostRepository.findById(jobId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Check employer ownership
        const company = await CompanyRepository.findByUserId(userId);
        if (!company || company.companyId !== job.companyId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // 3. Get applications
        return await ApplicationRepository.findByJobPost(jobId);
    }

    /**
     * Get application detail (Employer)
     * @param {string} userId
     * @param {number} applicationId
     */
    async getEmployerApplicationDetail(userId, applicationId) {
        // 1. Get application
        const application = await ApplicationRepository.findDetailById(applicationId);
        if (!application) {
            const error = new Error(MESSAGES.APPLICATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Verified employer ownership
        const company = await CompanyRepository.findByUserId(userId);
        if (!company || company.companyId !== application.jobPost.companyId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // 3. Update status to Viewed if Pending
        if (application.status === 'Pending') {
            await ApplicationRepository.updateStatus(applicationId, 'Viewed');

            // Notification: Status changed to Viewed (Optional per requirement? User asked for update status endpoint, but detail view also updates status)
            // Implicit change might not need notification or maybe "Đã xem". 
            // The requirement specifically mentions PATCH status endpoint. Let's keep notification there primarily.
            application.status = 'Viewed';
        }

        return application;
    }

    /**
     * Update application status (Employer)
     * @param {string} userId
     * @param {number} applicationId
     * @param {string} status
     * @param {string} note
     */
    async updateApplicationStatus(userId, applicationId, status, note) {
        const validStatuses = ['Pending', 'Viewed', 'Interview', 'Accepted', 'Rejected'];
        if (!validStatuses.includes(status)) {
            const error = new Error(MESSAGES.INVALID_APPLICATION_STATUS);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // 1. Get application
        const application = await ApplicationRepository.findDetailById(applicationId);
        if (!application) {
            const error = new Error(MESSAGES.APPLICATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Verified employer ownership
        const company = await CompanyRepository.findByUserId(userId);
        if (!company || company.companyId !== application.jobPost.companyId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // 3. Update status
        const result = await ApplicationRepository.updateStatus(applicationId, status, note);

        // 4. Notification: Send to Candidate
        try {
            const { saveAndSendNotification } = require('./SocketService');
            // Assuming status mappings:
            // "Viewed": "Đã xem"
            // "Interview": "Phỏng vấn"
            // "Accepted": "Trúng tuyển"
            // "Rejected": "Từ chối"

            const statusMap = {
                'Viewed': 'Đã xem',
                'Interview': 'Phỏng vấn',
                'Accepted': 'Trúng tuyển',
                'Rejected': 'Từ chối',
                'Pending': 'Chờ duyệt'
            };

            const statusVN = statusMap[status] || status;
            const jobTitle = application.jobPost ? application.jobPost.title : 'Công việc';

            const notificationData = {
                title: 'Cập nhật hồ sơ ứng tuyển',
                message: `Hồ sơ ứng tuyển ${jobTitle} của bạn đã được chuyển sang trạng thái ${statusVN}.`,
                type: 'APPLICATION_STATUS',
                jobId: application.jobPostId,
                status: status
            };

            await saveAndSendNotification(application.userId, 'new_notification', notificationData);

        } catch (err) {
            console.error('Socket Notification Error (Update Status):', err.message);
        }

        return result;
    }

    async getEmployerApplications(userId, queryParams) {
        const { jobPostId, skillIds, minExperience, page, limit } = queryParams;

        const company = await CompanyRepository.findByUserId(userId);
        if (!company) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        if (jobPostId) {
            const jobPost = await JobPostRepository.findById(jobPostId);
            if (!jobPost) {
                const error = new Error(MESSAGES.JOB_NOT_FOUND);
                error.status = HTTP_STATUS.NOT_FOUND;
                throw error;
            }

            if (jobPost.companyId !== company.companyId) {
                const error = new Error(MESSAGES.FORBIDDEN);
                error.status = HTTP_STATUS.FORBIDDEN;
                throw error;
            }
        }

        const offset = (page - PAGINATION_DEFAULTS.PAGE) * limit;
        const { count, rows } = await ApplicationRepository.findAndCountForEmployerApplications(
            company.companyId,
            { jobPostId, skillIds, minExperience, limit, offset }
        );

        const applications = rows.map((application) => ({
            applicationId: application.applicationId,
            userName: application.user?.fullName || null,
            experienceYears: application.user?.experienceYears ?? 0,
            skills: (application.user?.skills || []).map((skill) => skill.name),
            status: application.status,
            appliedAt: application.createdAt
        }));

        return {
            applications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                limit
            }
        };
    }

    async downloadCvForEmployer(userId, applicationId) {
        const company = await CompanyRepository.findByUserId(userId);
        if (!company) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        const application = await ApplicationRepository.findEmployerDownloadCvByApplicationId(applicationId);
        if (!application) {
            const error = new Error(MESSAGES.APPLICATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (!application.jobPost || application.jobPost.companyId !== company.companyId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        if (!application.resume || !application.resume.fileUrl) {
            const error = new Error(MESSAGES.RESUME_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (application.status === 'Pending') {
            await ApplicationRepository.updateStatus(applicationId, 'Viewed');
        }

        let response;
        try {
            response = await axios({
                method: 'get',
                url: application.resume.fileUrl,
                responseType: 'arraybuffer',
                timeout: 15000
            });
        } catch (downloadError) {
            const error = new Error(MESSAGES.RESUME_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const responseContentType = response.headers ? response.headers['content-type'] : null;
        const contentType = responseContentType && responseContentType.includes('pdf')
            ? responseContentType
            : 'application/pdf';

        return {
            fileName: application.resume.fileName || `application-${applicationId}-cv.pdf`,
            contentType,
            fileBuffer: Buffer.from(response.data)
        };
    }
}

module.exports = new ApplicationService();
