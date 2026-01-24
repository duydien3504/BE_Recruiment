const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
    messageId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'message_id'
    },
    conversationsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'conversations_id'
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'sender_id'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_deleted'
    }
}, {
    tableName: 'messages',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Message;
