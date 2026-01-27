const BaseRepository = require('./BaseRepository');
const { Follow } = require('../models');

class FollowRepository extends BaseRepository {
    constructor() {
        super(Follow);
    }

    async findByUser(userId, options = {}) {
        const { Company } = require('../models');

        return await this.findAll({ userId }, {
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['companyId', 'name', 'logoUrl', 'scale', 'websiteUrl', 'addressDetail']
                }
            ],
            order: [['created_at', 'DESC']],
            ...options
        });
    }

    async findByCompany(companyId, options = {}) {
        return await this.findAll({ companyId }, options);
    }

    async checkFollowing(userId, companyId) {
        return await this.findOne({ userId, companyId });
    }

    async followCompany(userId, companyId) {
        return await this.create({ userId, companyId });
    }

    async unfollowCompany(userId, companyId) {
        return await this.model.destroy({ where: { userId, companyId } });
    }
}

module.exports = new FollowRepository();
