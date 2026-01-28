const LocationService = require('../services/LocationService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');
const Joi = require('joi');

class LocationController {
    /**
     * Get all locations
     * @route GET /api/v1/locations
     */
    async getAllLocations(req, res, next) {
        try {
            const locations = await LocationService.getAllLocations();
            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_LOCATIONS_SUCCESS,
                data: locations
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create location (Admin)
     * @route POST /api/v1/admin/locations
     */
    async createLocation(req, res, next) {
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

            const location = await LocationService.createLocation(req.body);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.CREATE_LOCATION_SUCCESS,
                data: location
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update location (Admin)
     * @route PUT /api/v1/admin/locations/:id
     */
    async updateLocation(req, res, next) {
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
            const updatedLocation = await LocationService.updateLocation(id, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_LOCATION_SUCCESS,
                data: updatedLocation
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete location (Admin)
     * @route DELETE /api/v1/admin/locations/:id
     */
    async deleteLocation(req, res, next) {
        try {
            const { id } = req.params;
            await LocationService.deleteLocation(id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.DELETE_LOCATION_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LocationController();
