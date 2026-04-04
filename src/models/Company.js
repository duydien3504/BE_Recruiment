const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize.define('Company', {
    companyId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'company_id'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'user_id'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    taxCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'tax_code'
    },
    logoUrl: {
        type: DataTypes.STRING(500),
        field: 'logo_url'
    },
    backgroundUrl: {
        type: DataTypes.STRING(500),
        field: 'background_url'
    },
    websiteUrl: {
        type: DataTypes.STRING(500),
        field: 'website_url'
    },
    scale: {
        type: DataTypes.STRING(50)
    },
    description: {
        type: DataTypes.TEXT
    },
    addressDetail: {
        type: DataTypes.TEXT,
        field: 'address_detail'
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        field: 'phone_number'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Pending'),
        defaultValue: 'Pending'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_deleted'
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'companies',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Company;
