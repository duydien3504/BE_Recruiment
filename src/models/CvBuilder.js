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
  templateId: { // FK trỏ vào bảng cv_templates. Default là mẫu IT cơ bản.
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'modern_it_01',
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
  columnLayout: {
    // Lưu cấu trúc cột (ví dụ: cột trái chứa mục nào, cột phải chứa mục nào)
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    field: 'column_layout'
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
  },
  pdfUrl: {
    // URL file PDF đã xuất và lưu trên Cloudinary (Cache)
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null,
    field: 'pdf_url'
  },
  lastPdfVersion: {
    // Phiên bản CV tại thời điểm xuất PDF thành công (để so sánh cache)
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    field: 'last_pdf_version'
  }
}, {
  tableName: 'cv_builders',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // Optimistic Locking: tự động thêm cột `version` và kiểm tra khi update/save
  // Sequelize sẽ ném OptimisticLockError nếu version không khớp
  version: true
});

module.exports = CvBuilder;
