const CategoryRepository = require('../repositories/CategoryRepository');
const redisClient = require('../config/redis');

class CategoryService {
    async getAllCategories() {
        const cacheKey = 'data:categories:all';
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const categories = await CategoryRepository.findAllActive({
            attributes: ['categoryId', 'name'],
            order: [['name', 'ASC']]
        });

        await redisClient.set(cacheKey, JSON.stringify(categories), 'EX', 86400); // Cache 24 hours
        return categories;
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

        const result = await CategoryRepository.create({ name });
        await redisClient.del('data:categories:all');
        return result;
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

        const result = await CategoryRepository.update(id, { name });
        await redisClient.del('data:categories:all');
        return result;
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

        const result = await CategoryRepository.update(id, { isDeleted: true });
        await redisClient.del('data:categories:all');
        return result;
    }
}

module.exports = new CategoryService();
