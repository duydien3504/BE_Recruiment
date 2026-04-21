const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

class PdfExportService {
    /**
     * Render HTML từ file EJS được chỉ định, sau đó xuất ra PDF Buffer bằng Puppeteer.
     * ejsPath được cung cấp từ Controller/Service sau khi tra cứu bảng cv_templates,
     * đảm bảo đúng template người dùng đang chọn.
     * @param {object} cvData       - Toàn bộ nội dung CV
     * @param {object} themeConfig  - Mã màu, font chữ người dùng đã tùy chỉnh
     * @param {object} columnLayout - Bố cục cột (left/right sections array)
     * @param {string} ejsPath      - Đường dẫn tương đối đến file .ejs (từ cột cv_templates.ejs_path)
     * @returns {Promise<Buffer>}
     */
    /**
     * Render EJS template thành chuỗi HTML.
     */
    async renderHtml(cvData, themeConfig, columnLayout, ejsPath) {
        const resolvedEjsPath = ejsPath
            ? path.join(__dirname, ejsPath)
            : path.join(__dirname, 'templates', 'cv_template.ejs');

        return await ejs.renderFile(resolvedEjsPath, {
            cvData: cvData || {},
            themeConfig: themeConfig || {},
            columnLayout: columnLayout || null
        });
    }

    async generatePdf(cvData, themeConfig, columnLayout, ejsPath) {
        // Render HTML từ file EJS đã xác định
        const htmlContent = await this.renderHtml(cvData, themeConfig, columnLayout, ejsPath);

        // Launch Puppeteer headless browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Ngăn crash RAM trên server nhỏ
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Cho phép tất cả resource (fonts, images của template) load bình thường
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            req.continue();
        });

        // Đẩy HTML vào page, chờ font Google Fonts và ảnh load xong
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });

        // Xuất PDF chuẩn A4, không margin (template tự quản lý spacing)
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Đảm bảo màu nền sidebar và accent color được in
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        await browser.close();

        return pdfBuffer;
    }
}

module.exports = new PdfExportService();

