const axios = require('axios');
const pdfParse = require('pdf-parse');

/**
 * Extracts text from a remote PDF file URL.
 * O(n) where n is size of PDF buffer.
 * @param {string} fileUrl 
 * @returns {Promise<string>}
 */
async function extractTextFromPdfUrl(fileUrl) {
    try {
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const data = await pdfParse(response.data);
        return data.text;
    } catch (error) {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
}

module.exports = {
    extractTextFromPdfUrl
};
