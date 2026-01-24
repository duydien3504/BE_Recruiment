const { sequelize } = require('../config/database');
const models = require('../models');

const syncDatabase = async () => {
    try {
        console.log('Bắt đầu đồng bộ hóa database...');

        // Sync all models to database
        // alter: true sẽ update schema nếu có thay đổi (không xóa data)
        // force: true sẽ DROP và tạo lại bảng (XÓA DATA - chỉ dùng dev)
        await sequelize.sync({ alter: true });

        console.log('Đồng bộ hóa database thành công.');
        console.log('Tất cả bảng đã được tạo/cập nhật.');

        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi đồng bộ hóa database:', error.message);
        process.exit(1);
    }
};

syncDatabase();
