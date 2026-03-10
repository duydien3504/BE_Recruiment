const { ResumeRepository } = require('../repositories');
const uploadService = require('../utils/uploadService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class ResumeService {
    /**
     * Upload resume
     * @param {string} userId
     * @param {Object} file - { buffer, originalname, size, mimetype }
     */
    async uploadResume(userId, file) {
        // 1. Validate file (should be handled by middleware, but good to double check or if logic needed)
        // Handled below

        // 2. Check Quota (Max 5 resumes total)
        const totalResumes = await ResumeRepository.countByUser(userId);
        if (totalResumes >= 5) {
            const error = new Error(MESSAGES.RESUME_QUOTA_EXCEEDED);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // 3. Check Daily Limit (Max 2 resumes / day)
        const dailyCount = await ResumeRepository.countUploadedToday(userId);
        if (dailyCount >= 2) {
            const error = new Error(MESSAGES.RESUME_DAILY_LIMIT_EXCEEDED);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }



        // 4. Upload to Cloudinary
        const fileUrl = await uploadService.uploadToCloudinary(file.buffer, 'resumes', {
            resource_type: 'raw' // Theo yêu cầu: Sử dụng raw cho PDF
        });

        // 5. Save to DB
        // Determine isMain: if first resume, set as main
        const isFirst = totalResumes === 0;

        const resume = await ResumeRepository.create({
            userId,
            fileUrl,
            fileName: file.originalname,
            isMain: isFirst
        });

        return resume;
    }

    /**
     * Delete resume
     * @param {string} userId
     * @param {string} resumeId
     */
    async deleteResume(userId, resumeId) {
        const resume = await ResumeRepository.findById(resumeId);

        if (!resume) {
            const error = new Error(MESSAGES.RESUME_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Verify ownership
        if (resume.userId !== userId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Soft delete
        return await ResumeRepository.softDelete(resumeId);
    }

    /**
     * Get user's resumes
     * @param {string} userId
     */
    async getMyResumes(userId) {
        return await ResumeRepository.findByUser(userId, {
            order: [['created_at', 'DESC']]
        });
    }

    /**
     * Get resume detail
     * @param {string} userId
     * @param {string} resumeId
     */
    async getResumeDetail(userId, resumeId) {
        const resume = await ResumeRepository.findById(resumeId);

        if (!resume) {
            const error = new Error(MESSAGES.RESUME_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Verify ownership
        if (resume.userId !== userId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        return resume;
    }

    /**
     * Update resume (replace file)
     * @param {string} userId
     * @param {string} resumeId
     * @param {Object} file
     */
    async updateResume(userId, resumeId, file) {
        const resume = await ResumeRepository.findById(resumeId);

        if (!resume) {
            const error = new Error(MESSAGES.RESUME_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (resume.userId !== userId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // Upload new file
        const fileUrl = await uploadService.uploadToCloudinary(file.buffer, 'resumes', {
            resource_type: 'raw',
            public_id: `resume_${resumeId}_${Date.now()}` // Optional: unique name
        });

        // Update DB
        return await ResumeRepository.update(resumeId, {
            fileUrl,
            fileName: file.originalname
        });
    }

    /**
     * Set main resume
     * @param {string} userId
     * @param {string} resumeId
     */
    async setMainResume(userId, resumeId) {
        const resume = await ResumeRepository.findById(resumeId);

        if (!resume) {
            const error = new Error(MESSAGES.RESUME_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (resume.userId !== userId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        return await ResumeRepository.setMainResume(resumeId, userId);
    }
}


module.exports = new ResumeService();
