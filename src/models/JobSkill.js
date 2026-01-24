const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobSkill = sequelize.define('JobSkill', {
    jobPostId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: 'job_post_id'
    },
    skillId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: 'skill_id'
    }
}, {
    tableName: 'job_skills',
    timestamps: false,
    underscored: true
});

module.exports = JobSkill;
