const BaseRepository = require('./BaseRepository');
const { Otp } = require('../models');
const { Op } = require('sequelize');

class OtpRepository extends BaseRepository {
    constructor() {
        super(Otp);
    }

    async findLatestByUserAndType(userId, type) {
        return await this.findOne(
            { userId, type, isUsed: false },
            { order: [['createdAt', 'DESC']] }
        );
    }

    async findValidOtp(userId, code, type) {
        return await this.findOne({
            userId,
            code,
            type,
            isUsed: false,
            expiredAt: { [Op.gt]: new Date() }
        });
    }

    async markAsUsed(otpId) {
        return await this.update(otpId, { isUsed: true });
    }

    async deleteExpiredOtps() {
        return await this.model.destroy({
            where: {
                expiredAt: { [Op.lt]: new Date() }
            }
        });
    }
}

module.exports = new OtpRepository();
