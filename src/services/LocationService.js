const LocationRepository = require('../repositories/LocationRepository');
const redisClient = require('../config/redis');

class LocationService {
    async getAllLocations() {
        const cacheKey = 'data:locations:all';
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const locations = await LocationRepository.findAllActive({
            attributes: ['locationId', 'name'],
            order: [['name', 'ASC']]
        });

        await redisClient.set(cacheKey, JSON.stringify(locations), 'EX', 86400); // Cache 24 hours
        return locations;
    }

    async createLocation(data) {
        const { name } = data;
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const exists = await LocationRepository.findByName(name);
        if (exists) {
            const error = new Error('Địa điểm này đã tồn tại.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const result = await LocationRepository.create({ name });
        await redisClient.del('data:locations:all');
        return result;
    }

    async updateLocation(id, data) {
        const { name } = data;
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const location = await LocationRepository.findById(id);
        if (!location) {
            const error = new Error(MESSAGES.LOCATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (name && name !== location.name) {
            const exists = await LocationRepository.findByName(name);
            if (exists && exists.locationId != id) {
                const error = new Error('Tên địa điểm đã tồn tại.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }
        }

        const result = await LocationRepository.update(id, { name });
        await redisClient.del('data:locations:all');
        return result;
    }

    async deleteLocation(id) {
        const HTTP_STATUS = require('../constant/statusCode');
        const MESSAGES = require('../constant/messages');

        const location = await LocationRepository.findById(id);
        if (!location) {
            const error = new Error(MESSAGES.LOCATION_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Hard delete likely as Location doesn't have isDeleted column based on model
        const result = await LocationRepository.delete(id);
        await redisClient.del('data:locations:all');
        return result;
    }
}

module.exports = new LocationService();
