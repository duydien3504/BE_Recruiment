const LevelRepository = require('../../src/repositories/LevelRepository');
const { Level } = require('../../src/models');

jest.mock('../../src/models');

describe('LevelRepository', () => {
    let mockLevel;
    

    beforeEach(() => {
        jest.clearAllMocks();
        

        mockLevel = {
            levelId: 1,
            name: 'Intern',
            created_at: '2024-01-01T00:00:00.000Z',
            update: jest.fn(),
            destroy: jest.fn()
        };
    });

    describe('findByName', () => {
        test('should find level by name', async () => {
            Level.findOne = jest.fn().mockResolvedValue(mockLevel);

            const result = await LevelRepository.findByName('Intern');

            expect(Level.findOne).toHaveBeenCalledWith({
                where: { name: 'Intern' }
            });
            expect(result).toEqual(mockLevel);
        });

        test('should return null when level not found', async () => {
            Level.findOne = jest.fn().mockResolvedValue(null);

            const result = await LevelRepository.findByName('NonExistent');

            expect(result).toBeNull();
        });
    });

    describe('findAllActive', () => {
        test('should find all levels ordered by name', async () => {
            const mockLevels = [
                { levelId: 1, name: 'Intern' },
                { levelId: 2, name: 'Junior' },
                { levelId: 3, name: 'Senior' }
            ];

            Level.findAll = jest.fn().mockResolvedValue(mockLevels);

            const result = await LevelRepository.findAllActive();

            expect(Level.findAll).toHaveBeenCalledWith({
                where: {},
                order: [['name', 'ASC']]
            });
            expect(result).toEqual(mockLevels);
        });

        test('should accept custom options', async () => {
            Level.findAll = jest.fn().mockResolvedValue([]);

            await LevelRepository.findAllActive({ limit: 5 });

            expect(Level.findAll).toHaveBeenCalledWith({
                where: {},
                order: [['name', 'ASC']],
                limit: 5
            });
        });
    });

    describe('findById', () => {
        test('should find level by ID', async () => {
            Level.findByPk = jest.fn().mockResolvedValue(mockLevel);

            const result = await LevelRepository.findById(1);

            expect(Level.findByPk).toHaveBeenCalledWith(1, {});
            expect(result).toEqual(mockLevel);
        });

        test('should return null when level not found', async () => {
            Level.findByPk = jest.fn().mockResolvedValue(null);

            const result = await LevelRepository.findById(999);

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        test('should create new level', async () => {
            const newLevelData = { name: 'Mid-level' };
            const createdLevel = { levelId: 4, ...newLevelData };

            Level.create = jest.fn().mockResolvedValue(createdLevel);

            const result = await LevelRepository.create(newLevelData);

            expect(Level.create).toHaveBeenCalledWith(newLevelData);
            expect(result).toEqual(createdLevel);
        });
    });

    describe('update', () => {
        test('should update level', async () => {
            const updateData = { name: 'Senior Developer' };
            const updatedLevel = { ...mockLevel, ...updateData };

            Level.findByPk = jest.fn().mockResolvedValue(mockLevel);
            mockLevel.update.mockResolvedValue(updatedLevel);

            const result = await LevelRepository.update(1, updateData);

            expect(Level.findByPk).toHaveBeenCalledWith(1, {});
            expect(mockLevel.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual(updatedLevel);
        });

        test('should return null when level not found', async () => {
            Level.findByPk = jest.fn().mockResolvedValue(null);

            const result = await LevelRepository.update(999, { name: 'Test' });

            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        test('should delete level', async () => {
            Level.findByPk = jest.fn().mockResolvedValue(mockLevel);
            mockLevel.destroy.mockResolvedValue();

            const result = await LevelRepository.delete(1);

            expect(Level.findByPk).toHaveBeenCalledWith(1, {});
            expect(mockLevel.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test('should return false when level not found', async () => {
            Level.findByPk = jest.fn().mockResolvedValue(null);

            const result = await LevelRepository.delete(999);

            expect(result).toBe(false);
        });
    });
});

