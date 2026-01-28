const CategoryService = require('../../src/services/CategoryService');
const CategoryRepository = require('../../src/repositories/CategoryRepository');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories/CategoryRepository');

describe('CategoryService.getCategoryDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const categoryId = 1;

    it('should return category detail', async () => {
        const mockCategory = { categoryId: 1, name: 'IT' };
        CategoryRepository.findByIdActive.mockResolvedValue(mockCategory);

        const result = await CategoryService.getCategoryDetail(categoryId);

        expect(CategoryRepository.findByIdActive).toHaveBeenCalledWith(categoryId);
        expect(result).toEqual(mockCategory);
    });

    it('should throw NOT_FOUND if category not found', async () => {
        CategoryRepository.findByIdActive.mockResolvedValue(null);

        await expect(CategoryService.getCategoryDetail(categoryId))
            .rejects.toThrow(MESSAGES.CATEGORY_NOT_FOUND);
    });
});
