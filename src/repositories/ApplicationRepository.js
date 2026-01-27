const BaseRepository = require('./BaseRepository');
const { Application } = require('../models');

class ApplicationRepository extends BaseRepository {
    constructor() {
        super(Application);
    }

    async findByJobPost(jobPostId, options = {}) {
        const { User, Resume } = require('../models');
        return await this.findAll({ jobPostId }, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['userId', 'fullName', 'email', 'phoneNumber', 'avatarUrl']
                },
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['resumesId', 'fileName', 'fileUrl']
                }
            ],
            order: [['created_at', 'DESC']],
            ...options
        });
    }

    async findByUser(userId, options = {}) {
        const { JobPost, Company, Location, Resume } = require('../models');

        return await this.findAll({ userId }, {
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    attributes: ['jobPostId', 'title', 'salaryMin', 'salaryMax', 'status', 'expiredAt', 'companyId', 'locationId'],
                    include: [
                        {
                            model: Company,
                            as: 'company',
                            attributes: ['companyId', 'name', 'logoUrl']
                        },
                        {
                            model: Location,
                            as: 'location',
                            attributes: ['locationId', 'name']
                        }
                    ]
                },
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['resumesId', 'fileName', 'fileUrl']
                }
            ],
            order: [['created_at', 'DESC']],
            ...options
        });
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status }, options);
    }

    async updateStatus(applicationId, status, employerNote = null) {
        const updateData = { status };
        if (employerNote) {
            updateData.employerNote = employerNote;
        }
        return await this.update(applicationId, updateData);
    }

    async checkExistingApplication(userId, jobPostId) {
        return await this.findOne({ userId, jobPostId });
    }

    async findDetailById(applicationId) {
        const { JobPost, Company, Location, Resume } = require('../models');
        return await this.findById(applicationId, {
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    attributes: ['jobPostId', 'title', 'salaryMin', 'salaryMax', 'status', 'expiredAt', 'companyId', 'locationId', 'description', 'requirements'],
                    include: [
                        { model: Company, as: 'company', attributes: ['companyId', 'name', 'logoUrl', 'scale', 'websiteUrl', 'addressDetail'] },
                        { model: Location, as: 'location', attributes: ['locationId', 'name'] }
                    ]
                },
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['resumesId', 'fileName', 'fileUrl']
                },
                {
                    model: require('../models').User,
                    as: 'user',
                    attributes: ['userId', 'fullName', 'email', 'phoneNumber', 'avatarUrl']
                }
            ]
        });
    }
}

module.exports = new ApplicationRepository();
