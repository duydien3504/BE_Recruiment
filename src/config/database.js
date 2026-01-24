const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Đọc CA Certificate nếu có cấu hình
let sslOptions = {};
if (process.env.CA_PATH) {
    try {
        const caPath = path.resolve(process.cwd(), process.env.CA_PATH);
        if (fs.existsSync(caPath)) {
            sslOptions = {
                ssl: {
                    ca: fs.readFileSync(caPath)
                }
            };
        } else {
            console.warn(`[CẢNH BÁO] Không tìm thấy file chứng chỉ tại: ${caPath}`);
        }
    } catch (error) {
        console.error('[LỖI] Không thể đọc file chứng chỉ SSL:', error.message);
    }
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 4000,
        dialect: 'mysql',
        dialectOptions: {
            ...sslOptions
        },
        logging: false, // Tắt log query mặc định của Sequelize cho gọn
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối Database thành công.');
    } catch (error) {
        console.error('Kết nối Database thất bại:', error.message);
        process.exit(1); // Exit nếu không kết nối được DB
    }
};

module.exports = { sequelize, connectDB };
