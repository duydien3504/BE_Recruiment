/**
 * Script thực thi migration: Tạo bảng cv_templates và cập nhật cv_builders
 * Chạy bằng: node src/scripts/runCvTemplateMigration.js
 */
require('dotenv').config();
const { sequelize } = require('../config/database');
const { Sequelize } = require('sequelize');

const runMigration = async () => {
    const queryInterface = sequelize.getQueryInterface();

    try {
        console.log('[MIGRATION] Bắt đầu...');
        await sequelize.authenticate();
        console.log('[MIGRATION] Kết nối DB thành công.');

        // ============================================================
        // BƯỚC 1: Kiểm tra và tạo bảng cv_templates nếu chưa có
        // ============================================================
        const tables = await queryInterface.showAllTables();
        if (!tables.includes('cv_templates')) {
            console.log('[MIGRATION] Tạo bảng cv_templates...');
            await queryInterface.createTable('cv_templates', {
                id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
                name: { type: Sequelize.STRING(100), allowNull: false },
                category: { type: Sequelize.STRING(50), allowNull: false },
                thumbnail_url: { type: Sequelize.TEXT, allowNull: true },
                ejs_path: { type: Sequelize.STRING(255), allowNull: false },
                default_config: {
                    type: Sequelize.JSONB,
                    allowNull: false,
                    defaultValue: { primaryColor: '#000000', fontFamily: 'Inter' }
                },
                is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
                created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
                updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
            });

            await queryInterface.addIndex('cv_templates', ['category'], { name: 'idx_cv_templates_category' });
            await queryInterface.addIndex('cv_templates', ['is_active'], { name: 'idx_cv_templates_is_active' });
            console.log('[MIGRATION] Bảng cv_templates tạo thành công.');
        } else {
            console.log('[MIGRATION] Bảng cv_templates đã tồn tại, bỏ qua bước tạo bảng.');
        }

        // ============================================================
        // BƯỚC 2: Seed dữ liệu ban đầu vào cv_templates
        // ============================================================
        const [existingTemplates] = await sequelize.query('SELECT id FROM cv_templates LIMIT 1');
        if (existingTemplates.length === 0) {
            console.log('[MIGRATION] Seeding dữ liệu template ban đầu...');
            await queryInterface.bulkInsert('cv_templates', [
                {
                    id: 'modern_it_01',
                    name: 'Template Coder',
                    category: 'IT',
                    thumbnail_url: 'https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/modern_it_01.png',
                    ejs_path: 'templates/cv_template.ejs',
                    default_config: JSON.stringify({ primaryColor: '#111111', fontFamily: 'Inter' }),
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: 'creative_marketing_01',
                    name: 'Creative Marketer',
                    category: 'Marketing',
                    thumbnail_url: 'https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/creative_marketing_01.png',
                    ejs_path: 'templates/cv_template.ejs',
                    default_config: JSON.stringify({ primaryColor: '#FF5722', fontFamily: 'Roboto' }),
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: 'elegant_business_01',
                    name: 'Business Strategy',
                    category: 'Business',
                    thumbnail_url: 'https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/elegant_business_01.png',
                    ejs_path: 'templates/cv_template.ejs',
                    default_config: JSON.stringify({ primaryColor: '#3F51B5', fontFamily: 'Merriweather' }),
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: 'minimal_it_02',
                    name: 'Minimalist Dev',
                    category: 'IT',
                    thumbnail_url: 'https://res.cloudinary.com/djn694zux/image/upload/v1/recruitment/templates/minimal_it_02.png',
                    ejs_path: 'templates/cv_template.ejs',
                    default_config: JSON.stringify({ primaryColor: '#2196F3', fontFamily: 'Fira Code' }),
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]);
            console.log('[MIGRATION] Seed dữ liệu thành công - 4 templates đã được thêm.');
        } else {
            console.log('[MIGRATION] Dữ liệu template đã tồn tại, bỏ qua bước seed.');
        }

        // ============================================================
        // BƯỚC 3: Cập nhật bảng cv_builders
        // ============================================================
        console.log('[MIGRATION] Cập nhật bảng cv_builders...');

        // 3a. Cập nhật các record cũ có template_id không hợp lệ
        await sequelize.query(`
            UPDATE cv_builders 
            SET template_id = 'modern_it_01' 
            WHERE template_id = 'default_template' 
               OR template_id NOT IN (SELECT id FROM cv_templates)
        `);
        console.log('[MIGRATION] Đã làm sạch template_id cũ trong cv_builders.');

        // 3b. Thêm cột column_layout nếu chưa có
        const cvBuilderCols = await queryInterface.describeTable('cv_builders');
        if (!cvBuilderCols.column_layout) {
            await queryInterface.addColumn('cv_builders', 'column_layout', {
                type: Sequelize.JSONB,
                allowNull: true,
                defaultValue: {
                    left: ['profile', 'contact', 'about', 'skills'],
                    right: ['experience', 'education', 'projects']
                }
            });
            console.log('[MIGRATION] Đã thêm cột column_layout vào cv_builders.');
        } else {
            console.log('[MIGRATION] Cột column_layout đã tồn tại trong cv_builders.');
        }

        // 3c. Thêm FK constraint nếu chưa có
        try {
            await queryInterface.addConstraint('cv_builders', {
                fields: ['template_id'],
                type: 'foreign key',
                name: 'fk_cv_builders_template_id',
                references: { table: 'cv_templates', field: 'id' },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE'
            });
            console.log('[MIGRATION] Đã thêm Foreign Key constraint.');
        } catch (fkErr) {
            if (fkErr.message && fkErr.message.includes('already exists')) {
                console.log('[MIGRATION] FK constraint đã tồn tại, bỏ qua.');
            } else {
                throw fkErr;
            }
        }

        console.log('\n✅ [MIGRATION] Hoàn tất! Các thay đổi đã được đồng bộ lên Neon DB.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ [MIGRATION] Lỗi:', error.message);
        console.error(error);
        process.exit(1);
    }
};

runMigration();
