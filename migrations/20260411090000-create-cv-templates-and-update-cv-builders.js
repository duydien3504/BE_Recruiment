'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // ============================================================
        // BƯỚC 1: Tạo bảng cv_templates (phải tạo trước vì cv_builders sẽ FK vào đây)
        // ============================================================
        await queryInterface.createTable('cv_templates', {
            id: {
                type: Sequelize.STRING(50),
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            category: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            thumbnail_url: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            ejs_path: {
                // Đường dẫn file .ejs tương đối trên server
                type: Sequelize.STRING(255),
                allowNull: false
            },
            default_config: {
                // JSONB để PostgreSQL/Neon hỗ trợ indexing hiệu quả
                type: Sequelize.JSONB,
                allowNull: false,
                defaultValue: { primaryColor: '#000000', fontFamily: 'Inter' }
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });

        // Index hỗ trợ filter theo category (dùng nhiều nhất ở giao diện chọn mẫu)
        await queryInterface.addIndex('cv_templates', ['category'], {
            name: 'idx_cv_templates_category'
        });
        await queryInterface.addIndex('cv_templates', ['is_active'], {
            name: 'idx_cv_templates_is_active'
        });

        // ============================================================
        // BƯỚC 2: Seed dữ liệu ban đầu từ file constant/templates.js cũ
        // ============================================================
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

        // ============================================================
        // BƯỚC 3: Cập nhật bảng cv_builders
        //  - Đổi defaultValue của template_id từ 'default_template' sang 'modern_it_01'
        //  - Thêm FK constraint trỏ vào cv_templates.id
        //  - Thêm cột column_layout nếu chưa có
        // ============================================================

        // 3a. Cập nhật default value của template_id trước (không thể để FK trỏ đến ID không tồn tại)
        await queryInterface.changeColumn('cv_builders', 'template_id', {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'modern_it_01'
        });

        // 3b. Cập nhật các record cũ có template_id = 'default_template' sang giá trị hợp lệ
        await queryInterface.sequelize.query(`
            UPDATE cv_builders 
            SET template_id = 'modern_it_01' 
            WHERE template_id = 'default_template' OR template_id NOT IN (SELECT id FROM cv_templates)
        `);

        // 3c. Thêm cột column_layout vào cv_builders nếu chưa có
        const tableInfo = await queryInterface.describeTable('cv_builders');
        if (!tableInfo.column_layout) {
            await queryInterface.addColumn('cv_builders', 'column_layout', {
                type: Sequelize.JSONB,
                allowNull: true,
                defaultValue: {
                    left: ['profile', 'contact', 'about', 'skills'],
                    right: ['experience', 'education', 'projects']
                }
            });
        }

        // 3d. Thêm Foreign Key constraint sau khi đã làm sạch dữ liệu
        await queryInterface.addConstraint('cv_builders', {
            fields: ['template_id'],
            type: 'foreign key',
            name: 'fk_cv_builders_template_id',
            references: {
                table: 'cv_templates',
                field: 'id'
            },
            onDelete: 'RESTRICT', // Không cho xóa template nếu còn người dùng đang dùng
            onUpdate: 'CASCADE'   // Khi sửa ID template thì tự cập nhật theo
        });
    },

    async down(queryInterface, Sequelize) {
        // Bỏ FK trước khi xóa bảng
        await queryInterface.removeConstraint('cv_builders', 'fk_cv_builders_template_id');

        // Khôi phục lại cột template_id về dạng cũ không có ràng buộc
        await queryInterface.changeColumn('cv_builders', 'template_id', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'default_template'
        });

        // Xóa bảng cv_templates
        await queryInterface.dropTable('cv_templates');
    }
};
