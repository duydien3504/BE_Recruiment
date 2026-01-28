const CategoryController = require('../../src/controllers/CategoryController');
const CategoryService = require('../../src/services/CategoryService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CategoryService');

const req = {
    params: { id: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('CategoryController.deleteCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        CategoryService.deleteCategory.mockResolvedValue(true);

        await CategoryController.deleteCategory(req, res, next);

        expect(CategoryService.deleteCategory).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.DELETE_CATEGORY_SUCCESS
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        CategoryService.deleteCategory.mockRejectedValue(error);

        await CategoryController.deleteCategory(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
