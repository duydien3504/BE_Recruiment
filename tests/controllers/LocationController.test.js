const LocationController = require('../../src/controllers/LocationController');
const LocationService = require('../../src/services/LocationService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/LocationService');

const req = {
    params: { id: 1 },
    body: { name: 'Hanoi' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('LocationController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getAllLocations should return 200', async () => {
        LocationService.getAllLocations.mockResolvedValue([]);
        await LocationController.getAllLocations(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });

    it('createLocation should return 201', async () => {
        LocationService.createLocation.mockResolvedValue({});
        await LocationController.createLocation(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    });

    it('updateLocation should return 200', async () => {
        LocationService.updateLocation.mockResolvedValue({});
        await LocationController.updateLocation(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });

    it('deleteLocation should return 200', async () => {
        LocationService.deleteLocation.mockResolvedValue(true);
        await LocationController.deleteLocation(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
});
