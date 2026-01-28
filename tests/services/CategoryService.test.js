const CategoryService = require('../../src/services/CategoryService');
const CategoryRepository = require('../../src/repositories/CategoryRepository');

jest.mock('../../src/repositories/CategoryRepository');

describe('CategoryService.getAllCategories', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return list of active categories', async () => {
        const mockCategories = [{ categoryId: 1, name: 'IT' }, { categoryId: 2, name: 'Marketing' }];
        CategoryRepository.findAllActive.mockResolvedValue(mockCategories);

        const result = await CategoryService.getAllCategories();

        expect(CategoryRepository.findAllActive).toHaveBeenCalledWith({
            attributes: ['categoryId', 'name'],
            order: [['name', 'ASC']]
        });
        expect(result).toEqual(mockCategories);
    });

    it('should return empty list if no categories found', async () => {
        CategoryRepository.findAllActive.mockResolvedValue([]);

        const result = await CategoryService.getAllCategories();

        expect(result).toEqual([]);
    });
});
