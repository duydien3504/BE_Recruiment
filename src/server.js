const app = require('./app');
const { sequelize, connectDB } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        // Kết nối Database
        await connectDB();

        // Tự động đồng bộ hóa database (tạo bảng nếu chưa có)
        console.log('Đang kiểm tra và đồng bộ hóa cấu trúc database...');
        await sequelize.sync();
        console.log('Đồng bộ hóa database hoàn tất.');

        app.listen(PORT, () => {
            console.log(`Server đang chạy tại cổng http://localhost:${PORT}`);
            console.log(`Swagger UI tại http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Lỗi khi khởi động server:', error.message);
        process.exit(1);
    }
};

startServer();
