const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Conversation = sequelize.define('Conversation', {
    conversationsId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'conversations_id'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'company_id'
    },
    lastMessageAt: {
        type: DataTypes.DATE,
        field: 'last_message_at'
    }
}, {
    tableName: 'conversations',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Conversation;
