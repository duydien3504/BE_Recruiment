const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Otp = sequelize.define('Otp', {
    otpId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'otp_id'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('VerifyEmail', 'ResetPassword'),
        allowNull: false
    },
    expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expired_at'
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_used'
    }
}, {
    tableName: 'otps',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Otp;
