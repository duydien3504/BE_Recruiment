const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CvTemplate = sequelize.define('CvTemplate', {
    id: {
        // PK dạng String: Vừa là ID, vừa là tên nhận dạng. Ví dụ: 'modern_01'
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        field: 'id'
    },
    name: {
        // Tên hiển thị thân thiện cho người dùng
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'name'
    },
    category: {
        // Phân loại ngành nghề: IT, Marketing, Business, Freelance...
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'category'
    },
    thumbnailUrl: {
        // URL ảnh preview mẫu CV
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'thumbnail_url'
    },
    ejsPath: {
        // Đường dẫn tương đối đến file .ejs template.
        // Ví dụ: 'templates/modern_01.ejs' — PdfExportService sẽ dùng field này để tìm file cần render.
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'ejs_path'
    },
    defaultConfig: {
        // Cấu hình giao diện mặc định của template: màu chủ đạo, font chữ...
        // FE sẽ dùng để pre-fill Color Picker khi user chọn mẫu này lần đầu.
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            primaryColor: '#000000',
            fontFamily: 'Inter'
        },
        field: 'default_config'
    },
    isActive: {
        // Admin có thể ẩn/hiện template mà không cần xóa khỏi DB
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'cv_templates',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = CvTemplate;
