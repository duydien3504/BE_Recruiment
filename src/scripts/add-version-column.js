/**
 * Migration Script: Thêm cột `version` vào bảng cv_builders
 * Mục đích: Hỗ trợ Optimistic Locking (chống chồng lấn dữ liệu)
 * 
 * Chạy: node src/scripts/add-version-column.js
 */
const { sequelize } = require('../config/database');

async function migrate() {
    try {
        console.log('[Migration] Đang kết nối tới Database...');
        await sequelize.authenticate();
        console.log('[Migration] Kết nối thành công.');

        // Kiểm tra xem cột đã tồn tại chưa (tránh lỗi khi chạy lại)
        const [results] = await sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'cv_builders' AND column_name = 'version'
        `);

        if (results.length > 0) {
            console.log('[Migration] Cột "version" đã tồn tại. Không cần thêm.');
        } else {
            await sequelize.query(`
                ALTER TABLE cv_builders 
                ADD COLUMN version INTEGER NOT NULL DEFAULT 0
            `);
            console.log('[Migration] ✅ Đã thêm cột "version" vào bảng cv_builders thành công.');
        }

        await sequelize.close();
        console.log('[Migration] Hoàn tất.');
        process.exit(0);
    } catch (error) {
        console.error('[Migration] ❌ Lỗi:', error.message);
        process.exit(1);
    }
}

migrate();
