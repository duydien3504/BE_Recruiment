const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SavedJob = sequelize.define('SavedJob', {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'user_id'
    },
    jobPostId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: 'job_post_id'
    }
}, {
    tableName: 'saved_jobs',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = SavedJob;
