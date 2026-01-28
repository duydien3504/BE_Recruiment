const CategoryRepository = require('../repositories/CategoryRepository');

class CategoryService {
    async getAllCategories() {
        return await CategoryRepository.findAllActive({
            attributes: ['categoryId', 'name'],
            order: [['name', 'ASC']]
        });
    }

    async getCategoryDetail(id) {
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const category = await CategoryRepository.findByIdActive(id);
        if (!category) {
            const error = new Error(MESSAGES.CATEGORY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }
        return category;
    }

    async createCategory(data) {
        const { name } = data;
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        // Check if exists
        const exists = await CategoryRepository.findByName(name);
        if (exists) {
            const error = new Error('Ngành nghề này đã tồn tại.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        return await CategoryRepository.create({ name });
    }

    async updateCategory(id, data) {
        const { name } = data;
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const category = await CategoryRepository.findByIdActive(id);
        if (!category) {
            const error = new Error(MESSAGES.CATEGORY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (name && name !== category.name) {
            const exists = await CategoryRepository.findByName(name);
            if (exists && exists.categoryId != id) {
                const error = new Error('Tên ngành nghề đã tồn tại.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }
        }

        return await CategoryRepository.update(id, { name });
    }

    async deleteCategory(id) {
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const category = await CategoryRepository.findByIdActive(id);
        if (!category) {
            const error = new Error(MESSAGES.CATEGORY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        return await CategoryRepository.update(id, { isDeleted: true });
    }
}

module.exports = new CategoryService();
