/**
 * Migration Script: Thêm cột `pdf_url` và `last_pdf_version` vào bảng cv_builders
 * Mục đích: Hỗ trợ Cache PDF trên Cloudinary, tránh render lại nếu CV chưa thay đổi.
 * 
 * Chạy: node src/scripts/add-pdf-cache-columns.js
 */
const { sequelize } = require('../config/database');

async function migrate() {
    try {
        console.log('[Migration] Đang kết nối tới Database...');
        await sequelize.authenticate();
        console.log('[Migration] Kết nối thành công.');

        // ── Thêm cột pdf_url ──
        const [pdfUrlResult] = await sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'cv_builders' AND column_name = 'pdf_url'
        `);

        if (pdfUrlResult.length > 0) {
            console.log('[Migration] Cột "pdf_url" đã tồn tại. Bỏ qua.');
        } else {
            await sequelize.query(`
                ALTER TABLE cv_builders 
                ADD COLUMN pdf_url VARCHAR(500) DEFAULT NULL
            `);
            console.log('[Migration] ✅ Đã thêm cột "pdf_url".');
        }

        // ── Thêm cột last_pdf_version ──
        const [lastPdfVersionResult] = await sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'cv_builders' AND column_name = 'last_pdf_version'
        `);

        if (lastPdfVersionResult.length > 0) {
            console.log('[Migration] Cột "last_pdf_version" đã tồn tại. Bỏ qua.');
        } else {
            await sequelize.query(`
                ALTER TABLE cv_builders 
                ADD COLUMN last_pdf_version INTEGER DEFAULT NULL
            `);
            console.log('[Migration] ✅ Đã thêm cột "last_pdf_version".');
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
