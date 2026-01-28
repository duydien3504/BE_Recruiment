const CategoryService = require('../services/CategoryService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');
const Joi = require('joi');

class CategoryController {
    /**
     * Get all categories
     * @route GET /api/v1/categories
     */
    async getAllCategories(req, res, next) {
        try {
            const categories = await CategoryService.getAllCategories();
            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_CATEGORIES_SUCCESS,
                data: categories
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get category detail
     * @route GET /api/v1/categories/:id
     */
    async getCategoryDetail(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryService.getCategoryDetail(id);
            return res.status(HTTP_STATUS.OK).json({
                message: 'Lấy chi tiết ngành nghề thành công.',
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create category (Admin)
     * @route POST /api/v1/admin/categories
     */
    async createCategory(req, res, next) {
        try {
            const schema = Joi.object({
                name: Joi.string().required().trim()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                const err = new Error(error.details[0].message);
                err.status = HTTP_STATUS.BAD_REQUEST;
                throw err;
            }

            const category = await CategoryService.createCategory(req.body);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.CREATE_CATEGORY_SUCCESS,
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update category (Admin)
     * @route PUT /api/v1/admin/categories/:id
     */
    async updateCategory(req, res, next) {
        try {
            const schema = Joi.object({
                name: Joi.string().required().trim()
            });

            const { error } = schema.validate(req.body);
            if (error) {
                const err = new Error(error.details[0].message);
                err.status = HTTP_STATUS.BAD_REQUEST;
                throw err;
            }

            const { id } = req.params;
            const updatedCategory = await CategoryService.updateCategory(id, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_CATEGORY_SUCCESS,
                data: updatedCategory
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete category (Admin)
     * @route DELETE /api/v1/admin/categories/:id
     */
    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            await CategoryService.deleteCategory(id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.DELETE_CATEGORY_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
