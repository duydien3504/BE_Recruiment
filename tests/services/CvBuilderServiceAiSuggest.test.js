const CvBuilderService = require('../../src/services/CvBuilderService');
const OpenRouterService = require('../../src/utils/OpenRouterService');

jest.mock('../../src/utils/OpenRouterService', () => ({
    generateText: jest.fn()
}));

describe('CvBuilderService.generateAiSuggestion', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should clean up bullet outputs and filter short lines successfully', async () => {
        const rawAiResponse = `
- Suggestion 1 is long enough validation.
* Suggestion 2 is also long enough text.
• Suggestion 3 has bullet mark.
1. Suggestion 4 has number mark.
- too
`;
        OpenRouterService.generateText.mockResolvedValue(rawAiResponse);

        const payload = {
            industry: 'IT',
            section: 'Kinh nghiệm',
            currentText: 'JS dev'
        };

        const result = await CvBuilderService.generateAiSuggestion(payload);

        expect(OpenRouterService.generateText).toHaveBeenCalled();
        expect(result).toHaveLength(4); // Filtered out 'too' because length <= 5
        expect(result).toEqual([
            'Suggestion 1 is long enough validation.',
            'Suggestion 2 is also long enough text.',
            'Suggestion 3 has bullet mark.',
            'Suggestion 4 has number mark.'
        ]); // Regex has cleaned up prefixes
    });

    it('should format infoSource according to currentText or keyword', async () => {
        OpenRouterService.generateText.mockResolvedValue('Suggestion 1 valid.');
        
        await CvBuilderService.generateAiSuggestion({
            industry: 'IT',
            section: 'Exp',
            keyword: 'ReactJS'
        });

        // Ensure generation called
        expect(OpenRouterService.generateText).toHaveBeenCalled();
        // Since we cannot easily inspect the exact template string generated inside logic visually, check it was executed.
        const providedPrompt = OpenRouterService.generateText.mock.calls[0][0];
        expect(providedPrompt).toContain('ReactJS');
    });

    it('should throw error if OpenRouterService fails', async () => {
        OpenRouterService.generateText.mockRejectedValue(new Error('API Down'));

        await expect(CvBuilderService.generateAiSuggestion({
            industry: 'IT',
            section: 'Exp'
        })).rejects.toThrow('API Down');
    });
});
