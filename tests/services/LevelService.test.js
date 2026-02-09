const LevelService = require('../../src/services/LevelService');
const LevelRepository = require('../../src/repositories/LevelRepository');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories/LevelRepository');

describe('LevelService', () => {
    let mockLevel;

    beforeEach(() => {
        jest.clearAllMocks();

        mockLevel = {
            levelId: 1,
            name: 'Intern',
            created_at: '2024-01-01T00:00:00.000Z',
            createdAt: '2024-01-01T00:00:00.000Z'
        };
    });

    describe('getAllLevels', () => {
        test('should return all levels', async () => {
            const mockLevels = [
                { levelId: 1, name: 'Intern', created_at: '2024-01-01T00:00:00.000Z' },
                { levelId: 2, name: 'Junior', created_at: '2024-01-02T00:00:00.000Z' }
            ];

            LevelRepository.findAllActive.mockResolvedValue(mockLevels);

            const result = await LevelService.getAllLevels();

            expect(LevelRepository.findAllActive).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                levelId: 1,
                name: 'Intern',
                createdAt: '2024-01-01T00:00:00.000Z'
            });
        });

        test('should return empty array when no levels exist', async () => {
            LevelRepository.findAllActive.mockResolvedValue([]);

            const result = await LevelService.getAllLevels();

            expect(result).toEqual([]);
        });
    });

    describe('getLevelById', () => {
        test('should return level by ID', async () => {
            LevelRepository.findById.mockResolvedValue(mockLevel);

            const result = await LevelService.getLevelById(1);

            expect(LevelRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                levelId: 1,
                name: 'Intern',
                createdAt: '2024-01-01T00:00:00.000Z'
            });
        });

        test('should throw error when level not found', async () => {
            LevelRepository.findById.mockResolvedValue(null);

            await expect(LevelService.getLevelById(999))
                .rejects
                .toThrow(MESSAGES.LEVEL_NOT_FOUND);
        });

        test('should throw error with NOT_FOUND status', async () => {
            LevelRepository.findById.mockResolvedValue(null);

            try {
                await LevelService.getLevelById(999);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('createLevel', () => {
        test('should create new level successfully', async () => {
            const levelData = { name: 'Mid-level' };
            const createdLevel = {
                levelId: 4,
                name: 'Mid-level',
                created_at: '2024-01-01T00:00:00.000Z'
            };

            LevelRepository.findByName.mockResolvedValue(null);
            LevelRepository.create.mockResolvedValue(createdLevel);

            const result = await LevelService.createLevel(levelData);

            expect(LevelRepository.findByName).toHaveBeenCalledWith('Mid-level');
            expect(LevelRepository.create).toHaveBeenCalledWith({ name: 'Mid-level' });
            expect(result).toEqual({
                levelId: 4,
                name: 'Mid-level',
                createdAt: '2024-01-01T00:00:00.000Z'
            });
        });

        test('should throw error when level name already exists', async () => {
            const levelData = { name: 'Intern' };

            LevelRepository.findByName.mockResolvedValue(mockLevel);

            await expect(LevelService.createLevel(levelData))
                .rejects
                .toThrow(MESSAGES.LEVEL_NAME_EXISTS);
        });

        test('should throw error with BAD_REQUEST status when name exists', async () => {
            const levelData = { name: 'Intern' };

            LevelRepository.findByName.mockResolvedValue(mockLevel);

            try {
                await LevelService.createLevel(levelData);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.BAD_REQUEST);
            }
        });
    });

    describe('updateLevel', () => {
        test('should update level successfully', async () => {
            const updateData = { name: 'Senior Developer' };
            const updatedLevel = {
                levelId: 1,
                name: 'Senior Developer',
                created_at: '2024-01-01T00:00:00.000Z'
            };

            LevelRepository.findById
                .mockResolvedValueOnce(mockLevel)
                .mockResolvedValueOnce(updatedLevel);
            LevelRepository.findByName.mockResolvedValue(null);
            LevelRepository.update.mockResolvedValue([1]);

            const result = await LevelService.updateLevel(1, updateData);

            expect(LevelRepository.findById).toHaveBeenCalledWith(1);
            expect(LevelRepository.findByName).toHaveBeenCalledWith('Senior Developer');
            expect(LevelRepository.update).toHaveBeenCalledWith(1, { name: 'Senior Developer' });
            expect(result.name).toBe('Senior Developer');
        });

        test('should throw error when level not found', async () => {
            LevelRepository.findById.mockResolvedValue(null);

            await expect(LevelService.updateLevel(999, { name: 'Test' }))
                .rejects
                .toThrow(MESSAGES.LEVEL_NOT_FOUND);
        });

        test('should throw error when new name already exists', async () => {
            const existingLevel = { levelId: 2, name: 'Junior' };

            LevelRepository.findById.mockResolvedValue(mockLevel);
            LevelRepository.findByName.mockResolvedValue(existingLevel);

            await expect(LevelService.updateLevel(1, { name: 'Junior' }))
                .rejects
                .toThrow(MESSAGES.LEVEL_NAME_EXISTS);
        });

        test('should allow updating with same name', async () => {
            const updateData = { name: 'Intern' };

            LevelRepository.findById
                .mockResolvedValueOnce(mockLevel)
                .mockResolvedValueOnce(mockLevel);
            LevelRepository.update.mockResolvedValue([1]);

            const result = await LevelService.updateLevel(1, updateData);

            expect(LevelRepository.findByName).not.toHaveBeenCalled();
            expect(result.name).toBe('Intern');
        });
    });

    describe('deleteLevel', () => {
        test('should delete level successfully', async () => {
            LevelRepository.findById.mockResolvedValue(mockLevel);
            LevelRepository.delete.mockResolvedValue(1);

            await LevelService.deleteLevel(1);

            expect(LevelRepository.findById).toHaveBeenCalledWith(1);
            expect(LevelRepository.delete).toHaveBeenCalledWith(1);
        });

        test('should throw error when level not found', async () => {
            LevelRepository.findById.mockResolvedValue(null);

            await expect(LevelService.deleteLevel(999))
                .rejects
                .toThrow(MESSAGES.LEVEL_NOT_FOUND);
        });

        test('should throw error with NOT_FOUND status', async () => {
            LevelRepository.findById.mockResolvedValue(null);

            try {
                await LevelService.deleteLevel(999);
            } catch (error) {
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });
});


