const LocationRepository = require('../repositories/LocationRepository');

class LocationService {
    async getAllLocations() {
        return await LocationRepository.findAllActive({
            attributes: ['locationId', 'name'],
            order: [['name', 'ASC']]
        });
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

        return await LocationRepository.create({ name });
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

        return await LocationRepository.update(id, { name });
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
        return await LocationRepository.delete(id);
    }
}

module.exports = new LocationService();
