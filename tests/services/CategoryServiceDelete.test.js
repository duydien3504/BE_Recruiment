const CategoryService = require('../../src/services/CategoryService');
const CategoryRepository = require('../../src/repositories/CategoryRepository');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories/CategoryRepository');

describe('CategoryService.deleteCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const id = 1;

    it('should delete category successfully', async () => {
        CategoryRepository.findByIdActive.mockResolvedValue({ categoryId: 1, name: 'To be deleted' });
        CategoryRepository.update.mockResolvedValue([1]);

        await CategoryService.deleteCategory(id);

        expect(CategoryRepository.findByIdActive).toHaveBeenCalledWith(id);
        expect(CategoryRepository.update).toHaveBeenCalledWith(id, { isDeleted: true });
    });

    it('should throw NOT_FOUND if category does not exist', async () => {
        CategoryRepository.findByIdActive.mockResolvedValue(null);

        await expect(CategoryService.deleteCategory(id))
            .rejects.toThrow(MESSAGES.CATEGORY_NOT_FOUND);
    });
});
