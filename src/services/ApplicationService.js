const { ApplicationRepository, JobPostRepository, ResumeRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

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

        return await ApplicationRepository.create(applicationData);
    }

    /**
     * Get candidate applications
     * @param {string} userId
     */
    async getCandidateApplications(userId) {
        return await ApplicationRepository.findByUser(userId);
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
        const { CompanyRepository } = require('../repositories');

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
        const { CompanyRepository } = require('../repositories');

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
        const { CompanyRepository } = require('../repositories');

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
        return await ApplicationRepository.updateStatus(applicationId, status, note);
    }
}

module.exports = new ApplicationService();
