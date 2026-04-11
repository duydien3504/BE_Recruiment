/**
 * Script cập nhật ejs_path cho các template trong DB
 * và update default_config để màu accent đúng với thiết kế từng mẫu.
 * Chạy: node src/scripts/updateTemplateEjsPaths.js
 */
require('dotenv').config();
const { sequelize } = require('../config/database');

const UPDATES = [
    {
        id: 'modern_it_01',
        ejs_path: 'templates/cv_template.ejs',
        default_config: { primaryColor: '#00b14f', fontFamily: 'Inter' },
        thumbnail_url: 'https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/modern_it_01.png'
    },
    {
        id: 'creative_marketing_01',
        ejs_path: 'templates/cv_creative_01.ejs',
        default_config: { primaryColor: '#E9A800', fontFamily: 'Raleway' },
        thumbnail_url: 'https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/creative_marketing_01.png'
    },
    {
        id: 'elegant_business_01',
        ejs_path: 'templates/cv_minimal_01.ejs',
        default_config: { primaryColor: '#3F51B5', fontFamily: 'Lato' },
        thumbnail_url: 'https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/elegant_business_01.png'
    },
    {
        id: 'minimal_it_02',
        ejs_path: 'templates/cv_modern_gray_01.ejs',
        default_config: { primaryColor: '#4CAF50', fontFamily: 'Be Vietnam Pro' },
        thumbnail_url: 'https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/minimal_it_02.png'
    }
];

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('[UPDATE] Kết nối DB thành công.\n');

        for (const tmpl of UPDATES) {
            const [rows] = await sequelize.query(
                `UPDATE cv_templates 
                 SET ejs_path = :ejs_path,
                     default_config = :default_config::jsonb,
                     thumbnail_url = :thumbnail_url,
                     updated_at = NOW()
                 WHERE id = :id`,
                {
                    replacements: {
                        id: tmpl.id,
                        ejs_path: tmpl.ejs_path,
                        default_config: JSON.stringify(tmpl.default_config),
                        thumbnail_url: tmpl.thumbnail_url
                    }
                }
            );
            console.log(`✅ [${tmpl.id}] → ejs_path: "${tmpl.ejs_path}", primaryColor: "${tmpl.default_config.primaryColor}"`);
        }

        console.log('\n🎉 Cập nhật hoàn tất! Tất cả template đã được trỏ đúng file EJS.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Lỗi:', err.message);
        process.exit(1);
    }
};

run();
