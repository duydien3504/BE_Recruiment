const CategoryController = require('../../src/controllers/CategoryController');
const CategoryService = require('../../src/services/CategoryService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/CategoryService');

const req = {
    params: { id: 1 },
    body: { name: 'Updated name' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('CategoryController.updateCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and updated category', async () => {
        const mockUpdated = { categoryId: 1, ...req.body };
        CategoryService.updateCategory.mockResolvedValue(mockUpdated);

        await CategoryController.updateCategory(req, res, next);

        expect(CategoryService.updateCategory).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UPDATE_CATEGORY_SUCCESS,
            data: mockUpdated
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        CategoryService.updateCategory.mockRejectedValue(error);

        await CategoryController.updateCategory(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
