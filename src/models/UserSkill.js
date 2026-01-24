const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserSkill = sequelize.define('UserSkill', {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'user_id'
    },
    skillId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: 'skill_id'
    }
}, {
    tableName: 'user_skills',
    timestamps: false,
    underscored: true
});

module.exports = UserSkill;
