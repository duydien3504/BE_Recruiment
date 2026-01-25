const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Level = sequelize.define('Level', {
    levelId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'level_id'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'levels',
    timestamps: true,
    updatedAt: false, // User chỉ yêu cầu created_at
    underscored: true,
    createdAt: 'created_at'
});

module.exports = Level;
