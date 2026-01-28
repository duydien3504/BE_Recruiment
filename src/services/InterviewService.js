const { InterviewRepository, ApplicationRepository, CompanyRepository } = require('../repositories');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class InterviewService {
    /**
     * Create interview (Employer)
     * @param {string} userId
     * @param {Object} data
     */
    async createInterview(userId, data) {
        const { sequelize } = require('../config/database');
        const { applicationId, interview_time, type, location, meeting_link, note } = data;

        const transaction = await sequelize.transaction();

        try {
            // 1. Get Application
            const application = await ApplicationRepository.findDetailById(applicationId);
            if (!application) {
                const error = new Error(MESSAGES.APPLICATION_NOT_FOUND);
                error.status = HTTP_STATUS.NOT_FOUND;
                throw error;
            }

            // 2. Verify Employer Ownership
            const company = await CompanyRepository.findByUserId(userId);
            if (!company || company.companyId !== application.jobPost.companyId) {
                const error = new Error(MESSAGES.FORBIDDEN);
                error.status = HTTP_STATUS.FORBIDDEN;
                throw error;
            }

            // 3. Create Interview
            const interviewData = {
                applicationId,
                interviewTime: interview_time,
                type,
                location,
                meetingLink: meeting_link,
                note,
                status: 'Scheduled'
            };

            const interview = await InterviewRepository.create(interviewData, { transaction });

            // 4. Update Application Status
            await ApplicationRepository.updateStatus(applicationId, 'Interview', note, { transaction });

            await transaction.commit();

            // 5. Notification: Send to Candidate
            try {
                const { saveAndSendNotification } = require('./SocketService');
                const jobTitle = application.jobPost ? application.jobPost.title : 'Công việc';
                const companyName = company ? company.companyName : 'Công ty';

                const notificationData = {
                    title: 'Lời mời phỏng vấn mới!',
                    message: `Bạn nhận được lời mời phỏng vấn mới từ công ty ${companyName} cho vị trí ${jobTitle}.`,
                    type: 'INTERVIEW_INVITATION',
                    applicationId: applicationId,
                    interviewId: interview.interviewId,
                    interviewTime: interview_time
                };

                await saveAndSendNotification(application.userId, 'new_notification', notificationData);

            } catch (err) {
                console.error('Socket Notification Error (Create Interview):', err.message);
                // Non-blocking
            }

            return interview;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Update interview (Employer)
     * @param {string} userId
     * @param {number} interviewId
     * @param {Object} data
     */
    async updateInterview(userId, interviewId, data) {
        // 1. Check Interview exists
        const interview = await InterviewRepository.findById(interviewId);
        if (!interview) {
            const error = new Error(MESSAGES.INTERVIEW_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Verify Employer Ownership
        // Need to fetch application to check companyId
        const application = await ApplicationRepository.findDetailById(interview.applicationId);
        if (!application) {
            // Should technically not happen if data is consistent
            const error = new Error(MESSAGES.APPLICATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const company = await CompanyRepository.findByUserId(userId);
        if (!company || company.companyId !== application.jobPost.companyId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // 3. Update Interview
        const updateData = {};
        if (data.interview_time) updateData.interviewTime = data.interview_time;
        if (data.type) updateData.type = data.type;
        if (data.location !== undefined) updateData.location = data.location;
        if (data.meeting_link !== undefined) updateData.meetingLink = data.meeting_link;
        if (data.note !== undefined) updateData.note = data.note;

        return await InterviewRepository.update(interviewId, updateData);
    }

    /**
     * Cancel/Delete interview (Employer)
     * @param {string} userId
     * @param {number} interviewId
     */
    async cancelInterview(userId, interviewId) {
        const { sequelize } = require('../config/database');

        // 1. Check Interview exists
        const interview = await InterviewRepository.findById(interviewId);
        if (!interview) {
            const error = new Error(MESSAGES.INTERVIEW_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Verify Employer Ownership
        const application = await ApplicationRepository.findDetailById(interview.applicationId);
        if (!application) {
            const error = new Error(MESSAGES.APPLICATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const company = await CompanyRepository.findByUserId(userId);
        if (!company || company.companyId !== application.jobPost.companyId) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        // 3. Soft Delete Interview (and potentially revert app status?)
        // For now, just soft delete the interview as per requirement.
        // We use transaction in case we want to revert application status later.
        const transaction = await sequelize.transaction();
        try {
            await InterviewRepository.update(interviewId, {
                isDeleted: true,
                status: 'Cancelled'
            }, { transaction });

            // Optional: Revert application status to Viewed?
            // Requirement doesn't mention, but it's good practice.
            // Let's keep it simple for now as per "Nghiệp vụ: Xóa lịch" only.

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Get interview detail
     * @param {string} userId - Current user ID (Employer or Candidate)
     * @param {number} interviewId
     */
    async getInterviewDetail(userId, interviewId) {
        // 1. Get Interview
        const interview = await InterviewRepository.findById(interviewId);
        if (!interview) {
            const error = new Error(MESSAGES.INTERVIEW_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // 2. Authorization Check
        // Interview belongs to an Application
        // - If Employer: Must own the Company of the JobPost
        // - If Candidate: Must be the owner of the Application (User)

        const application = await ApplicationRepository.findDetailById(interview.applicationId);
        if (!application) {
            const error = new Error(MESSAGES.APPLICATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Check ownership
        const isCandidate = application.user.userId === userId; // Use application.user.userId instead of application.userId

        let isEmployer = false;
        if (application.jobPost && application.jobPost.companyId) {
            const company = await CompanyRepository.findByUserId(userId);
            if (company && company.companyId === application.jobPost.companyId) {
                isEmployer = true;
            }
        }

        if (!isCandidate && !isEmployer) {
            const error = new Error(MESSAGES.FORBIDDEN);
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        return interview;
    }

    /**
     * Get upcoming interviews for Employer
     * @param {string} userId
     */
    async getEmployerInterviews(userId) {
        const { CompanyRepository } = require('../repositories');

        // 1. Get Employer's Company
        const company = await CompanyRepository.findByUserId(userId);
        if (!company) {
            // If user has no company, they can't have interviews
            return [];
        }

        // 2. Find upcoming interviews for this company
        return await InterviewRepository.findUpcomingByCompany(company.companyId);
    }

    /**
     * Get upcoming interviews for Candidate
     * @param {string} userId
     */
    async getCandidateInterviews(userId) {
        return await InterviewRepository.findUpcomingByUser(userId);
    }
}

module.exports = new InterviewService();
