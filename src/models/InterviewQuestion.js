const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InterviewQuestion = sequelize.define('InterviewQuestion', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    applicationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'application_id'
    },
    questionContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'question_content'
    },
    expectedAnswer: {
        type: DataTypes.TEXT,
        field: 'expected_answer'
    },
    isSelected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_selected'
    }
}, {
    tableName: 'interview_questions',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = InterviewQuestion;
