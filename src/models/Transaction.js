const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
        allowNull: false,
        field: 'job_post_id'
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
        type: DataTypes.ENUM('Pending', 'Success', 'Failed', 'Cancelled'),
        defaultValue: 'Pending'
    }
}, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Transaction;
