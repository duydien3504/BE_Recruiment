const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CvBuilder = sequelize.define('CvBuilder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: { // Liên kết khóa ngoại với bảng Users
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  templateId: { // Ví dụ: 'modern_01', 'classical_02'
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default_template',
    field: 'template_id'
  },
  themeConfig: {
    // Quản lý Layer & Global Styling: theme, font, layout config (1 hay 2 cột)
    type: DataTypes.JSON, // Dùng JSON hoặc JSONB (PostgreSQL)
    defaultValue: {
      primaryColor: '#000000',
      layoutMode: '1-column',
      fontFamily: 'Inter'
    },
    field: 'theme_config'
  },
  cvData: {
    // Lưu toàn bộ dữ liệu Drag & Drop Editor: order_index, widget settings, rich text HTML
    type: DataTypes.JSON, 
    allowNull: false,
    defaultValue: {},
    field: 'cv_data'
  },
  atsScore: {
    // Phục vụ module Hệ thống Chấm điểm & Tối ưu ATS
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'ats_score'
  }
}, {
  tableName: 'cv_builders',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = CvBuilder;
