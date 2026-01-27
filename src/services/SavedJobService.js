const { SavedJobRepository, JobPostRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class SavedJobService {
    /**
     * Save job
     * @param {string} userId
     * @param {number} jobPostId
     */
    async saveJob(userId, jobPostId) {
        // 1. Check if job exists
        const job = await JobPostRepository.findById(jobPostId);
        if (!job) {
            const error = new Error(MESSAGES.JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Check if already saved
        const existing = await SavedJobRepository.checkSaved(userId, jobPostId);
        if (existing) {
            const error = new Error(MESSAGES.JOB_ALREADY_SAVED);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // 3. Save
        return await SavedJobRepository.saveJob(userId, jobPostId);
    }

    /**
     * Get saved jobs
     * @param {string} userId
     */
    async getSavedJobs(userId) {
        return await SavedJobRepository.findByUser(userId);
    }

    /**
     * Unsave job
     * @param {string} userId
     * @param {number} jobPostId
     */
    async unsaveJob(userId, jobPostId) {
        // 1. Check if saved
        const existing = await SavedJobRepository.checkSaved(userId, jobPostId);
        if (!existing) {
            const error = new Error(MESSAGES.SAVED_JOB_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Unsave
        return await SavedJobRepository.unsaveJob(userId, jobPostId);
    }
}

module.exports = new SavedJobService();
