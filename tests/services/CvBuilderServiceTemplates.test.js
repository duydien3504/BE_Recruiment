const CvBuilderService = require('../../src/services/CvBuilderService');
const { CvTemplateRepository } = require('../../src/repositories');

jest.mock('../../src/repositories', () => ({
    CvTemplateRepository: {
        findAllActive: jest.fn()
    }
}));

describe('CvBuilderService.getTemplates', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all templates if industry is not provided', async () => {
        const mockTemplates = [{ id: 1, category: 'IT' }, { id: 2, category: 'Marketing' }];
        CvTemplateRepository.findAllActive.mockResolvedValue(mockTemplates);
        
        const result = await CvBuilderService.getTemplates();
        expect(result).toEqual(mockTemplates);
        expect(CvTemplateRepository.findAllActive).toHaveBeenCalledWith(null);
    });

    it('should filter templates by category case-insensitively', async () => {
        const mockTemplates = [{ id: 1, category: 'IT' }];
        CvTemplateRepository.findAllActive.mockResolvedValue(mockTemplates);

        const itTemplates = await CvBuilderService.getTemplates('it');
        expect(itTemplates).toEqual(mockTemplates);
        expect(CvTemplateRepository.findAllActive).toHaveBeenCalledWith('it');
    });

    it('should return empty list if category does not exist', async () => {
        CvTemplateRepository.findAllActive.mockResolvedValue([]);
        const result = await CvBuilderService.getTemplates('UnknownIndustry');
        expect(result).toEqual([]);
        expect(CvTemplateRepository.findAllActive).toHaveBeenCalledWith('UnknownIndustry');
    });
});
