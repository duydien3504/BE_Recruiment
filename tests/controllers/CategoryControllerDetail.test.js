const CategoryController = require('../../src/controllers/CategoryController');
const CategoryService = require('../../src/services/CategoryService');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/CategoryService');

const req = {
    params: { id: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('CategoryController.getCategoryDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and category detail', async () => {
        const mockCategory = { categoryId: 1, name: 'IT' };
        CategoryService.getCategoryDetail.mockResolvedValue(mockCategory);

        await CategoryController.getCategoryDetail(req, res, next);

        expect(CategoryService.getCategoryDetail).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Lấy chi tiết ngành nghề thành công.',
            data: mockCategory
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        CategoryService.getCategoryDetail.mockRejectedValue(error);

        await CategoryController.getCategoryDetail(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
