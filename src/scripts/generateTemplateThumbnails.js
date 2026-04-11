/**
 * Script: Render mỗi EJS template thành ảnh PNG (thumbnail preview)
 * Dùng cùng Puppeteer pipeline của PdfExportService.
 * 
 * Chạy: node src/scripts/generateTemplateThumbnails.js
 */
require('dotenv').config();
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

// ─── Mock data để preview có nội dung ────────────────────────────────────────
const MOCK_CV = {
    personal: {
        fullName: 'Nguyễn Văn Anh',
        title: 'Software Engineer',
        phoneNumber: '0912 345 678',
        email: 'nguyenvananh@gmail.com',
        address: 'Hà Nội, Việt Nam',
        avatarUrl: null
    },
    about: '<p>Kỹ sư phần mềm với 3 năm kinh nghiệm phát triển ứng dụng web và mobile, đam mê xây dựng sản phẩm chất lượng cao, thân thiện với người dùng.</p>',
    skills: '<ul><li>JavaScript / TypeScript</li><li>React.js / Node.js</li><li>SQL & NoSQL Databases</li><li>Git, Docker, CI/CD</li></ul>',
    experience: [
        {
            id: 'exp1',
            company: 'Tech Solutions Vietnam',
            title: 'Frontend Developer',
            period: '2022 - Nay',
            description: '<p>Xây dựng và tối ưu hóa các tính năng giao diện cho ứng dụng web SaaS phục vụ 50,000+ người dùng. Cải thiện Core Web Vitals, tăng điểm hiệu suất từ 62 lên 94.</p>'
        }
    ],
    education: [
        {
            id: 'edu1',
            school: 'Đại học Bách Khoa Hà Nội',
            degree: 'Kỹ sư Công nghệ Thông tin',
            period: '2018 - 2022',
            description: ''
        }
    ],
    projects: [
        {
            id: 'proj1',
            name: 'E-commerce Platform',
            title: 'Lead Developer',
            period: '2023',
            description: '<p>Thiết kế và triển khai nền tảng thương mại điện tử xử lý 10,000+ đơn hàng/tháng.</p>'
        }
    ],
    awards: []
};

const MOCK_COLUMN_LAYOUT = {
    left: ['profile', 'contact', 'about', 'skills'],
    right: ['experience', 'education', 'projects']
};

// ─── Template configs ─────────────────────────────────────────────────────────
const TEMPLATES = [
    {
        id: 'modern_it_01',
        ejsFile: 'cv_it_modern.ejs',
        themeConfig: { primaryColor: '#00b14f', fontFamily: 'Inter', lineSpacing: 1.5, charSpacing: 0 },
        outputName: 'thumb_modern_it_01.png'
    },
    {
        id: 'creative_marketing_01',
        ejsFile: 'cv_marketing_hero.ejs',
        themeConfig: { primaryColor: '#E9A800', fontFamily: 'Raleway', lineSpacing: 1.55, charSpacing: 0 },
        outputName: 'thumb_creative_marketing_01.png'
    },
    {
        id: 'elegant_business_01',
        ejsFile: 'cv_business_elegant.ejs',
        themeConfig: { primaryColor: '#3F51B5', fontFamily: 'Lato', lineSpacing: 1.5, charSpacing: 0 },
        outputName: 'thumb_elegant_business_01.png'
    },
    {
        id: 'minimal_it_02',
        ejsFile: 'cv_social_warm.ejs',
        themeConfig: { primaryColor: '#7C3AED', fontFamily: 'Nunito', lineSpacing: 1.6, charSpacing: 0 },
        outputName: 'thumb_social_warm.png'
    }
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'thumbnails');

async function run() {
    // Tạo thư mục output nếu chưa có
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log('[INFO] Tạo thư mục:', OUTPUT_DIR);
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    console.log('[INFO] Puppeteer launched.');

    const { sequelize } = require('../config/database');

    for (const tpl of TEMPLATES) {
        const ejsPath = path.join(__dirname, '..', 'utils', 'templates', tpl.ejsFile);

        if (!fs.existsSync(ejsPath)) {
            console.warn('[WARN] Không tìm thấy file:', ejsPath);
            continue;
        }

        console.log(`\n[RENDER] ${tpl.id} (${tpl.ejsFile})...`);

        try {
            // Render HTML từ EJS
            const html = await ejs.renderFile(ejsPath, {
                cvData: MOCK_CV,
                themeConfig: tpl.themeConfig,
                columnLayout: MOCK_COLUMN_LAYOUT
            });

            const page = await browser.newPage();

            // A4 width = 794px (96dpi), tỷ lệ thu nhỏ xuống để làm thumbnail
            await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1.5 });

            await page.setRequestInterception(true);
            page.on('request', req => req.continue());

            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Chụp toàn bộ trang
            const outputPath = path.join(OUTPUT_DIR, tpl.outputName);
            await page.screenshot({
                path: outputPath,
                fullPage: false,  // chỉ lấy viewport (phần đầu trang)
                type: 'png'
            });

            await page.close();

            console.log(`[OK] Saved: ${outputPath}`);

            // Cập nhật thumbnail_url trong DB trỏ đến file local
            // (Nếu BE serve static files từ /public)
            const localUrl = `/thumbnails/${tpl.outputName}`;
            await sequelize.query(
                'UPDATE cv_templates SET thumbnail_url = :url WHERE id = :id',
                { replacements: { url: localUrl, id: tpl.id } }
            );
            console.log(`[DB] Updated thumbnail_url → ${localUrl}`);

        } catch (err) {
            console.error(`[ERROR] ${tpl.id}:`, err.message);
        }
    }

    await browser.close();
    console.log('\n✅ Done! Tất cả thumbnails đã được tạo và cập nhật DB.');
    process.exit(0);
}

run().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
