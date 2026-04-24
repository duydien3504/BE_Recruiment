require('dotenv').config();
const { sequelize } = require('../config/database');
const CV_TEMPLATES = require('../constant/templates');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('[INFO] Đang đồng bộ 14 mẫu CV vào Database...');
    
    for (const tpl of CV_TEMPLATES) {
      // Map constant to DB schema
      const dbTemplate = {
        id: tpl.templateId,
        name: tpl.name,
        category: tpl.category,
        ejs_path: 'utils/templates/cv_template.ejs', // Đường dẫn tương đối dùng chung
        default_config: JSON.stringify(tpl.defaultConfig),
        is_active: true
      };

      await sequelize.query(`
        INSERT INTO cv_templates (id, name, category, ejs_path, default_config, is_active, created_at, updated_at)
        VALUES (:id, :name, :category, :ejs_path, :default_config, :is_active, NOW(), NOW())
        ON CONFLICT (id) 
        DO UPDATE SET 
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            default_config = EXCLUDED.default_config,
            updated_at = NOW();
      `, {
        replacements: dbTemplate
      });
      console.log(`[SUCCESS] Đã cập nhật Template: ${tpl.name} (${tpl.templateId})`);
    }
    
    console.log('[DONE] Hoàn tất cập nhật 14 mẫu CV.');
  } catch (e) {
    console.error('[ERROR] Lỗi khi seed database:', e.message);
  } finally {
    process.exit(0);
  }
}

seed();
