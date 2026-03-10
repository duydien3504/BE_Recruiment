const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// SSL Configuration for TiDB Cloud and Neon
let dialectOptions = {};

// TiDB Cloud requires SSL connection
// Check if we're connecting to TiDB Cloud or Neon
const isTiDBCloud = process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com');
const isNeon = process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech');

if (isTiDBCloud) {
    // For TiDB Cloud: Use SSL with system CA (works on Render and most platforms)
    dialectOptions = {
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    };
    console.log('[INFO] Kết nối TiDB Cloud với SSL enabled');
} else if (isNeon) {
    dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    };
    console.log('[INFO] Kết nối Neon PostgreSQL với SSL enabled');
} else if (process.env.CA_PATH) {
    // For custom SSL certificate (local development with custom CA)
    try {
        const caPath = path.resolve(process.cwd(), process.env.CA_PATH);
        if (fs.existsSync(caPath)) {
            dialectOptions = {
                ssl: {
                    ca: fs.readFileSync(caPath),
                    rejectUnauthorized: true
                }
            };
            console.log('[INFO] Sử dụng custom SSL certificate');
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
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions,
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
