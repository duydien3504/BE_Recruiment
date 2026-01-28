const CategoryService = require('../../src/services/CategoryService');
const CategoryRepository = require('../../src/repositories/CategoryRepository');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories/CategoryRepository');

describe('CategoryService.createCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = { name: 'New Category' };

    it('should create category successfully', async () => {
        CategoryRepository.findByName.mockResolvedValue(null);
        CategoryRepository.create.mockResolvedValue({ categoryId: 1, ...data });

        const result = await CategoryService.createCategory(data);

        expect(CategoryRepository.findByName).toHaveBeenCalledWith(data.name);
        expect(CategoryRepository.create).toHaveBeenCalledWith(data);
        expect(result).toEqual({ categoryId: 1, ...data });
    });

    it('should throw BAD_REQUEST if category name exists', async () => {
        CategoryRepository.findByName.mockResolvedValue({ categoryId: 10, ...data });

        await expect(CategoryService.createCategory(data))
            .rejects.toThrow('Ngành nghề này đã tồn tại.');
    });
});
