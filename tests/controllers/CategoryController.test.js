const CategoryController = require('../../src/controllers/CategoryController');
const CategoryService = require('../../src/services/CategoryService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CategoryService');

const req = {};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('CategoryController.getAllCategories', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and category list', async () => {
        const mockCategories = [{ categoryId: 1, name: 'IT' }];
        CategoryService.getAllCategories.mockResolvedValue(mockCategories);

        await CategoryController.getAllCategories(req, res, next);

        expect(CategoryService.getAllCategories).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_CATEGORIES_SUCCESS,
            data: mockCategories
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        CategoryService.getAllCategories.mockRejectedValue(error);

        await CategoryController.getAllCategories(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
