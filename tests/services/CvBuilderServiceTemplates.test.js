const CvBuilderService = require('../../src/services/CvBuilderService');
const CV_TEMPLATES = require('../../src/constant/templates');

describe('CvBuilderService.getTemplates', () => {
    it('should return all templates if industry is not provided', async () => {
        const result = await CvBuilderService.getTemplates();
        expect(result).toEqual(CV_TEMPLATES);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should filter templates by industry case-insensitively', async () => {
        const itTemplates = await CvBuilderService.getTemplates('it');
        expect(itTemplates.length).toBeGreaterThan(0);
        itTemplates.forEach(t => {
            expect(t.category).toBe('IT');
        });

        const marketingTemplates = await CvBuilderService.getTemplates('MaRkeTing');
        expect(marketingTemplates.length).toBeGreaterThan(0);
        marketingTemplates.forEach(t => {
            expect(t.category).toBe('Marketing');
        });
    });

    it('should return empty list if industry does not exist', async () => {
        const result = await CvBuilderService.getTemplates('UnknownIndustry');
        expect(result).toEqual([]);
    });
});
