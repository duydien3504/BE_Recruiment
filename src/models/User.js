const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'user_id'
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'full_name'
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        field: 'phone_number'
    },
    address: {
        type: DataTypes.TEXT
    },
    avatarUrl: {
        type: DataTypes.STRING(500),
        field: 'avatar_url'
    },
    bio: {
        type: DataTypes.TEXT
    },
    roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'role_id'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Banned'),
        defaultValue: 'Inactive'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_deleted'
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;
