const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
    roleId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'role_id'
    },
    roleName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'role_name'
    }
}, {
    tableName: 'roles',
    timestamps: false,
    underscored: true
});

module.exports = Role;
