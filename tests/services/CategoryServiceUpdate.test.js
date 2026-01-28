const CategoryService = require('../../src/services/CategoryService');
const CategoryRepository = require('../../src/repositories/CategoryRepository');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories/CategoryRepository');

describe('CategoryService.updateCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const id = 1;
    const data = { name: 'Updated Category' };

    it('should update category successfully', async () => {
        // Mock finding existing category
        CategoryRepository.findByIdActive.mockResolvedValue({ categoryId: 1, name: 'Old Name' });
        // Mock checking duplicate name (none found)
        CategoryRepository.findByName.mockResolvedValue(null);
        // Mock update
        CategoryRepository.update.mockResolvedValue([1]);

        await CategoryService.updateCategory(id, data);

        expect(CategoryRepository.findByIdActive).toHaveBeenCalledWith(id);
        expect(CategoryRepository.findByName).toHaveBeenCalledWith(data.name);
        expect(CategoryRepository.update).toHaveBeenCalledWith(id, { name: data.name });
    });

    it('should throw NOT_FOUND if category does not exist', async () => {
        CategoryRepository.findByIdActive.mockResolvedValue(null);

        await expect(CategoryService.updateCategory(id, data))
            .rejects.toThrow(MESSAGES.CATEGORY_NOT_FOUND);
    });

    it('should throw BAD_REQUEST if new name duplicate with other category', async () => {
        CategoryRepository.findByIdActive.mockResolvedValue({ categoryId: 1, name: 'Old Name' });
        // Mock duplicate found with DIFFERENT id
        CategoryRepository.findByName.mockResolvedValue({ categoryId: 2, name: 'Updated Category' });

        await expect(CategoryService.updateCategory(id, data))
            .rejects.toThrow('Tên ngành nghề đã tồn tại.');
    });

    it('should allow update if name is same as current', async () => {
        const sameNameData = { name: 'Old Name' };
        CategoryRepository.findByIdActive.mockResolvedValue({ categoryId: 1, name: 'Old Name' });

        await CategoryService.updateCategory(id, sameNameData);

        // Should not call findByName
        expect(CategoryRepository.findByName).not.toHaveBeenCalled();
        expect(CategoryRepository.update).toHaveBeenCalledWith(id, { name: sameNameData.name });
    });
});
