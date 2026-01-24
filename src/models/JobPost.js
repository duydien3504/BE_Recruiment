const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobPost = sequelize.define('JobPost', {
    jobPostId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'job_post_id'
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'company_id'
    },
    categoryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'category_id'
    },
    locationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'location_id'
    },
    title: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    requirements: {
        type: DataTypes.TEXT
    },
    salaryMin: {
        type: DataTypes.DECIMAL(15, 2),
        field: 'salary_min'
    },
    salaryMax: {
        type: DataTypes.DECIMAL(15, 2),
        field: 'salary_max'
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Pending', 'Active', 'Expired', 'Closed', 'Rejected'),
        defaultValue: 'Draft'
    },
    expiredAt: {
        type: DataTypes.DATE,
        field: 'expired_at'
    },
    editCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'edit_count'
    },
    rejectionReason: {
        type: DataTypes.TEXT,
        field: 'rejection_reason'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_deleted'
    }
}, {
    tableName: 'job_posts',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = JobPost;
