const BaseRepository = require('./BaseRepository');
const { Interview } = require('../models');
const { Op } = require('sequelize');

class InterviewRepository extends BaseRepository {
    constructor() {
        super(Interview);
    }

    async findByApplication(applicationId) {
        return await this.findOne({ applicationId, isDeleted: false });
    }

    async findUpcoming(options = {}) {
        return await this.findAll({
            interviewTime: { [Op.gt]: new Date() },
            status: 'Scheduled',
            isDeleted: false
        }, options);
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status, isDeleted: false }, options);
    }

    async updateStatus(interviewId, status) {
        return await this.update(interviewId, { status });
    }

    async findUpcomingByCompany(companyId, options = {}) {
        const { Application, JobPost, User } = require('../models');

        return await this.findAll({
            interviewTime: { [Op.gt]: new Date() },
            status: 'Scheduled',
            isDeleted: false
        }, {
            attributes: ['interviewId', 'interviewTime', 'type', 'location', 'meetingLink', 'note', 'status'],
            include: [
                {
                    model: Application,
                    as: 'application',
                    required: true,
                    include: [
                        {
                            model: JobPost,
                            as: 'jobPost',
                            where: { companyId },
                            attributes: ['jobPostId', 'title']
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['userId', 'fullName', 'email', 'avatarUrl', 'phoneNumber']
                        }
                    ]
                }
            ],
            order: [['interviewTime', 'ASC']],
            ...options
        });
    }

    async findUpcomingByUser(userId, options = {}) {
        const { Application, JobPost, Company } = require('../models');

        return await this.findAll({
            status: 'Scheduled',
            isDeleted: false
        }, {
            attributes: ['interviewId', 'interviewTime', 'type', 'location', 'meetingLink', 'note', 'status'],
            include: [
                {
                    model: Application,
                    as: 'application',
                    required: true,
                    where: { userId },
                    include: [
                        {
                            model: JobPost,
                            as: 'jobPost',
                            attributes: ['jobPostId', 'title', 'companyId'],
                            include: [
                                {
                                    model: Company,
                                    as: 'company',
                                    attributes: ['companyId', 'name', 'logoUrl', 'addressDetail']
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['interviewTime', 'ASC']],
            ...options
        });
    }
}

module.exports = new InterviewRepository();
