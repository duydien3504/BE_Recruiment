const LocationService = require('../../src/services/LocationService');
const LocationRepository = require('../../src/repositories/LocationRepository');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories/LocationRepository');

describe('LocationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllLocations', () => {
        it('should return list of locations', async () => {
            const mockLocations = [{ id: 1, name: 'Hanoi' }];
            LocationRepository.findAllActive.mockResolvedValue(mockLocations);
            const result = await LocationService.getAllLocations();
            expect(result).toEqual(mockLocations);
        });
    });

    describe('createLocation', () => {
        it('should create location successfully', async () => {
            const data = { name: 'Hanoi' };
            LocationRepository.findByName.mockResolvedValue(null);
            LocationRepository.create.mockResolvedValue(data);
            const result = await LocationService.createLocation(data);
            expect(result).toEqual(data);
        });

        it('should throw error if exists', async () => {
            LocationRepository.findByName.mockResolvedValue({ id: 1 });
            await expect(LocationService.createLocation({ name: 'Hanoi' }))
                .rejects.toThrow('Địa điểm này đã tồn tại.');
        });
    });

    describe('updateLocation', () => {
        it('should update location successfully', async () => {
            LocationRepository.findById.mockResolvedValue({ id: 1, name: 'Old' });
            LocationRepository.findByName.mockResolvedValue(null);
            LocationRepository.update.mockResolvedValue([1]);
            await LocationService.updateLocation(1, { name: 'New' });
            expect(LocationRepository.update).toHaveBeenCalledWith(1, { name: 'New' });
        });
    });

    describe('deleteLocation', () => {
        it('should delete location successfully', async () => {
            LocationRepository.findById.mockResolvedValue({ id: 1 });
            LocationRepository.delete.mockResolvedValue(1);
            await LocationService.deleteLocation(1);
            expect(LocationRepository.delete).toHaveBeenCalledWith(1);
        });
    });
});
