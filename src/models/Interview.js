const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Interview = sequelize.define('Interview', {
    interviewId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'interview_id'
    },
    applicationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'application_id'
    },
    interviewTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'interview_time'
    },
    type: {
        type: DataTypes.ENUM('Online', 'Offline'),
        allowNull: false
    },
    location: {
        type: DataTypes.TEXT
    },
    meetingLink: {
        type: DataTypes.STRING(500),
        field: 'meeting_link'
    },
    note: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
        defaultValue: 'Scheduled'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_deleted'
    }
}, {
    tableName: 'interviews',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Interview;
