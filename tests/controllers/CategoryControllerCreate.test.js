const CategoryController = require('../../src/controllers/CategoryController');
const CategoryService = require('../../src/services/CategoryService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CategoryService');

const req = {
    body: { name: 'New Category' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('CategoryController.createCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and created category', async () => {
        const mockCategory = { categoryId: 1, ...req.body };
        CategoryService.createCategory.mockResolvedValue(mockCategory);

        await CategoryController.createCategory(req, res, next);

        expect(CategoryService.createCategory).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.CREATE_CATEGORY_SUCCESS,
            data: mockCategory
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        CategoryService.createCategory.mockRejectedValue(error);

        await CategoryController.createCategory(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it('should return error if name is missing', async () => {
        const invalidReq = { body: {} };
        await CategoryController.createCategory(invalidReq, res, next);
        expect(next).toHaveBeenCalled(); // Should call next with validation error
    });
});
