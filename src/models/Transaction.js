const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const {
    TRANSACTION_TYPE_VALUES,
    TRANSACTION_TYPES,
    TRANSACTION_STATUS_VALUES,
    TRANSACTION_STATUSES
} = require('../constant/transactionConstants');

const Transaction = sequelize.define('Transaction', {
    transactionId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'transaction_id'
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'company_id'
    },
    jobPostId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'job_post_id'
    },
    transactionType: {
        type: DataTypes.ENUM(...TRANSACTION_TYPE_VALUES),
        allowNull: false,
        defaultValue: TRANSACTION_TYPES.JOB_POST,
        field: 'transaction_type'
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'payment_method'
    },
    status: {
        type: DataTypes.ENUM(...TRANSACTION_STATUS_VALUES),
        defaultValue: TRANSACTION_STATUSES.PENDING
    }
}, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Transaction;
