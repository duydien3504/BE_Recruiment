const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
    applicationId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'application_id'
    },
    jobPostId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'job_post_id'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
    },
    resumesId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'resumes_id'
    },
    coverLetter: {
        type: DataTypes.TEXT,
        field: 'cover_letter'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Viewed', 'Interview', 'Accepted', 'Rejected'),
        defaultValue: 'Pending'
    },
    employerNote: {
        type: DataTypes.TEXT,
        field: 'employer_note'
    }
}, {
    tableName: 'applications',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Application;
