const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

class PdfExportService {
    /**
     * Render HTML then generate PDF Stream using Puppeteer
     * @param {object} cvData 
     * @param {object} themeConfig 
     * @returns {Promise<Buffer>}
     */
    async generatePdf(cvData, themeConfig, columnLayout) {
        // Path to the EJS template
        const templatePath = path.join(__dirname, 'templates', 'cv_template.ejs');
        
        // Render HTML from EJS
        const htmlContent = await ejs.renderFile(templatePath, {
            cvData: cvData || {},
            themeConfig: themeConfig || {},
            columnLayout: columnLayout || null
        });

        // Launch Puppeteer headless browser
        const browser = await puppeteer.launch({
            headless: 'new', // Using new headless implementation
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage', // critical to prevent RAM crashes on tiny servers
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        
        // Optimize rendering speed
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.continue();
            } else {
                req.continue();
            }
        });
        
        // Set HTML content to the page
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0' // wait until template fonts/images are fully resolved
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        await browser.close();

        return pdfBuffer;
    }
}

module.exports = new PdfExportService();
