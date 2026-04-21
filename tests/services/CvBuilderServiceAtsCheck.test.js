const CvBuilderService = require('../../src/services/CvBuilderService');
const OpenRouterService = require('../../src/utils/OpenRouterService');

jest.mock('../../src/utils/OpenRouterService', () => ({
    generateText: jest.fn()
}));

describe('CvBuilderService.checkAtsMatch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse valid AI JSON response and return correct format', async () => {
        const rawAiResponse = `
        \`\`\`json
        {
          "matchPercentage": 85,
          "missingKeywords": ["AWS", "Docker"],
          "recommendations": ["You lack AWS, consider adding."]
        }
        \`\`\` 
        `;
        OpenRouterService.generateText.mockResolvedValue(rawAiResponse);

        const result = await CvBuilderService.checkAtsMatch('JS developer', 'Need JS dev with AWS');

        expect(OpenRouterService.generateText).toHaveBeenCalledWith(
            expect.any(String),
            20000,
            { response_format: { type: "json_object" } }
        );
        expect(result).toEqual({
            matchPercentage: 85,
            missingKeywords: ['AWS', 'Docker'],
            recommendations: ['You lack AWS, consider adding.']
        });
    });

    it('should return default fallback types if AI hallucinates bad properties matching JSON', async () => {
        const weirdRawJson = `{
          "matchPercentage": "not a number",
          "missingKeywords": "not an array",
          "recommendations": "string instead of array"
        }`;
        OpenRouterService.generateText.mockResolvedValue(weirdRawJson);

        const result = await CvBuilderService.checkAtsMatch('A', 'B');

        // Service fallback defaults preventing crash
        expect(result).toEqual({
            matchPercentage: 0,
            missingKeywords: [],
            recommendations: []
        });
    });

    it('should throw Syntax Error wrapper if AI produces completely invalid JSON format', async () => {
        const badFormat = `This is not json { [what ]`;
        OpenRouterService.generateText.mockResolvedValue(badFormat);

        await expect(CvBuilderService.checkAtsMatch('A', 'B')).rejects.toThrow('Dữ liệu trả về từ AI không đúng chuẩn (Lỗi phân mảnh dữ liệu). Vui lòng thử lại.');
    });

    it('should bubble up generic AI API errors', async () => {
        OpenRouterService.generateText.mockRejectedValue(new Error('API Down'));

        await expect(CvBuilderService.checkAtsMatch('A', 'B')).rejects.toThrow('API Down');
    });
});
