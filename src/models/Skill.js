const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Skill = sequelize.define('Skill', {
    skillId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'skill_id'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'skills',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Skill;
