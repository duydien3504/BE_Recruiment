const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Resume = sequelize.define('Resume', {
    resumesId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'resumes_id'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
    },
    fileUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'file_url'
    },
    fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'file_name'
    },
    isMain: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_main'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_deleted'
    }
}, {
    tableName: 'resumes',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Resume;
