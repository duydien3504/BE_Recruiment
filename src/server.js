const app = require('./app');
const { sequelize, connectDB } = require('./config/database');
require('./models'); // Import models để đảm bảo đã load trước khi sync
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        // Kết nối Database
        await connectDB();

        // Tự động đồng bộ hóa database (tạo bảng nếu chưa có)
        console.log('Đang kiểm tra và đồng bộ hóa cấu trúc database...');

        // Tự động đồng bộ hóa database
        console.log('Đang kiểm tra trạng thái database...');

        // Khi DB đã ổn định, đặt alter: false để server khởi động nhanh và an toàn hơn.
        // Chỉ bật lại (alter: true) khi bạn sửa Model và muốn DB tự động cập nhật theo.
        await sequelize.sync({ alter: false });

        console.log('Database đã sẵn sàng.');

        const server = app.listen(PORT, () => {
            console.log(`Server đang chạy tại cổng http://localhost:${PORT}`);
            console.log(`Swagger UI tại http://localhost:${PORT}/api-docs`);
        });

        const { initSocket } = require('./services/SocketService');
        initSocket(server);
    } catch (error) {
        console.error('Lỗi khi khởi động server:', error.message);
        process.exit(1);
    }
};

startServer();
