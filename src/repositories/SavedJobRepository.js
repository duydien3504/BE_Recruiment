const BaseRepository = require('./BaseRepository');
const { SavedJob } = require('../models');

class SavedJobRepository extends BaseRepository {
    constructor() {
        super(SavedJob);
    }

    async findByUser(userId, options = {}) {

        const { JobPost, Company, Location, Level } = require('../models');

        return await this.findAll({ userId }, {
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    attributes: [
                        'jobPostId', 'title', 'salaryMin', 'salaryMax',
                        'status', 'expiredAt', 'created_at', 'companyId',
                        'locationId', 'levelId'
                    ],
                    include: [
                        {
                            model: Company,
                            as: 'company',
                            attributes: ['companyId', 'name', 'logoUrl', 'scale']
                        },
                        {
                            model: Location,
                            as: 'location',
                            attributes: ['locationId', 'name']
                        },
                        {
                            model: Level,
                            as: 'level',
                            attributes: ['levelId', 'name']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']],
            ...options
        });
    }
    async checkSaved(userId, jobPostId) {
        return await this.findOne({ userId, jobPostId });
    }

    async saveJob(userId, jobPostId) {
        return await this.create({ userId, jobPostId });
    }

    async unsaveJob(userId, jobPostId) {
        return await this.model.destroy({ where: { userId, jobPostId } });
    }
}

module.exports = new SavedJobRepository();
