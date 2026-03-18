jest.mock('pdf-parse', () => jest.fn());

const axios = require('axios');
const { extractTextFromPdfUrl } = require('../../src/utils/pdfExtractor');
const pdfParse = require('pdf-parse'); // Required after mock so it returns jest.fn()

jest.mock('axios');

describe('pdfExtractor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully extract text from PDF URL', async () => {
        const mockArrayBuffer = new ArrayBuffer(8);
        axios.get.mockResolvedValue({ data: mockArrayBuffer });
        pdfParse.mockResolvedValue({ text: 'Extracted CV Text' });

        const text = await extractTextFromPdfUrl('http://example.com/cv.pdf');

        expect(axios.get).toHaveBeenCalledWith('http://example.com/cv.pdf', { responseType: 'arraybuffer' });
        expect(pdfParse).toHaveBeenCalledWith(mockArrayBuffer);
        expect(text).toBe('Extracted CV Text');
    });

    it('should throw an error when axios fails', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        await expect(extractTextFromPdfUrl('http://example.com/cv.pdf'))
            .rejects
            .toThrow('Failed to extract text from PDF: Network Error');
    });

    it('should throw an error when pdfParse fails', async () => {
        axios.get.mockResolvedValue({ data: new ArrayBuffer(8) });
        pdfParse.mockRejectedValue(new Error('Parse Error'));

        await expect(extractTextFromPdfUrl('http://example.com/cv.pdf'))
            .rejects
            .toThrow('Failed to extract text from PDF: Parse Error');
    });
});
