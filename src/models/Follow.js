const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Follow = sequelize.define('Follow', {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'user_id'
    },
    companyId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'company_id'
    }
}, {
    tableName: 'follows',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Follow;
