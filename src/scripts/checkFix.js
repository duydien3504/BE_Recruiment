require('dotenv').config();
const { sequelize } = require('../config/database');

const templatesToInsert = [
  {
    id: 'modern_it_01',
    name: 'Modern IT 01',
    category: 'IT',
    ejs_path: 'templates/modern_it_01.ejs',
    default_config: JSON.stringify({ primaryColor: '#3b82f6', fontFamily: 'Inter' }),
    is_active: true
  },
  {
    id: 'creative_marketing_01',
    name: 'Creative Marketing',
    category: 'Marketing',
    ejs_path: 'templates/creative_marketing_01.ejs',
    default_config: JSON.stringify({ primaryColor: '#ec4899', fontFamily: 'Poppins' }),
    is_active: true
  },
  {
    id: 'elegant_business_01',
    name: 'Elegant Business',
    category: 'Business',
    ejs_path: 'templates/elegant_business_01.ejs',
    default_config: JSON.stringify({ primaryColor: '#0f172a', fontFamily: 'Merriweather' }),
    is_active: true
  },
  {
    id: 'minimal_it_02',
    name: 'Minimal IT 02',
    category: 'IT',
    ejs_path: 'templates/minimal_it_02.ejs',
    default_config: JSON.stringify({ primaryColor: '#10b981', fontFamily: 'Roboto' }),
    is_active: true
  },
  {
    id: 'default_template',
    name: 'Default Legacy Template',
    category: 'General',
    ejs_path: 'templates/default_template.ejs',
    default_config: JSON.stringify({ primaryColor: '#333333', fontFamily: 'Arial' }),
    is_active: true
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Inserting default templates...');
    
    for (const tpl of templatesToInsert) {
      await sequelize.query(`
        INSERT INTO cv_templates (id, name, category, ejs_path, default_config, is_active, created_at, updated_at)
        VALUES (:id, :name, :category, :ejs_path, :default_config, :is_active, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
      `, {
        replacements: tpl
      });
      console.log('Inserted/Verified:', tpl.id);
    }
    
    console.log('Done!');
  } catch (e) {
    console.error('Error during seeding:', e);
  } finally {
    process.exit(0);
  }
}

seed();
