const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Location = sequelize.define('Location', {
    locationId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'location_id'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'locations',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Location;
