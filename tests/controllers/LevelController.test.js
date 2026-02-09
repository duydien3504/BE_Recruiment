const LevelController = require('../../src/controllers/LevelController');
const LevelService = require('../../src/services/LevelService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/LevelService');

describe('LevelController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getAllLevels', () => {
        test('should return all levels with 200 status', async () => {
            const mockLevels = [
                { levelId: 1, name: 'Intern', createdAt: '2024-01-01T00:00:00.000Z' },
                { levelId: 2, name: 'Junior', createdAt: '2024-01-02T00:00:00.000Z' }
            ];

            LevelService.getAllLevels = jest.fn().mockResolvedValue(mockLevels);

            await LevelController.getAllLevels(req, res, next);

            expect(LevelService.getAllLevels).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_LEVELS_SUCCESS,
                data: mockLevels
            });
        });

        test('should call next with error when service fails', async () => {
            const error = new Error('Database error');
            LevelService.getAllLevels = jest.fn().mockRejectedValue(error);

            await LevelController.getAllLevels(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getLevelById', () => {
        test('should return level by ID with 200 status', async () => {
            const mockLevel = { levelId: 1, name: 'Intern', createdAt: '2024-01-01T00:00:00.000Z' };
            req.params.levelId = '1';

            LevelService.getLevelById = jest.fn().mockResolvedValue(mockLevel);

            await LevelController.getLevelById(req, res, next);

            expect(LevelService.getLevelById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_LEVEL_SUCCESS,
                data: mockLevel
            });
        });

        test('should call next with error when level not found', async () => {
            req.params.levelId = '999';
            const error = new Error(MESSAGES.LEVEL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;

            LevelService.getLevelById = jest.fn().mockRejectedValue(error);

            await LevelController.getLevelById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('createLevel', () => {
        test('should create level with 201 status', async () => {
            const levelData = { name: 'Mid-level' };
            const createdLevel = { levelId: 4, name: 'Mid-level', createdAt: '2024-01-01T00:00:00.000Z' };
            req.body = levelData;

            LevelService.createLevel = jest.fn().mockResolvedValue(createdLevel);

            await LevelController.createLevel(req, res, next);

            expect(LevelService.createLevel).toHaveBeenCalledWith(levelData);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.CREATE_LEVEL_SUCCESS,
                data: createdLevel
            });
        });

        test('should call next with error when name already exists', async () => {
            req.body = { name: 'Intern' };
            const error = new Error(MESSAGES.LEVEL_NAME_EXISTS);
            error.status = HTTP_STATUS.BAD_REQUEST;

            LevelService.createLevel = jest.fn().mockRejectedValue(error);

            await LevelController.createLevel(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateLevel', () => {
        test('should update level with 200 status', async () => {
            const updateData = { name: 'Senior Developer' };
            const updatedLevel = { levelId: 1, name: 'Senior Developer', createdAt: '2024-01-01T00:00:00.000Z' };
            req.params.levelId = '1';
            req.body = updateData;

            LevelService.updateLevel = jest.fn().mockResolvedValue(updatedLevel);

            await LevelController.updateLevel(req, res, next);

            expect(LevelService.updateLevel).toHaveBeenCalledWith(1, updateData);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.UPDATE_LEVEL_SUCCESS,
                data: updatedLevel
            });
        });

        test('should call next with error when level not found', async () => {
            req.params.levelId = '999';
            req.body = { name: 'Test' };
            const error = new Error(MESSAGES.LEVEL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;

            LevelService.updateLevel = jest.fn().mockRejectedValue(error);

            await LevelController.updateLevel(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteLevel', () => {
        test('should delete level with 200 status', async () => {
            req.params.levelId = '1';

            LevelService.deleteLevel = jest.fn().mockResolvedValue();

            await LevelController.deleteLevel(req, res, next);

            expect(LevelService.deleteLevel).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.DELETE_LEVEL_SUCCESS
            });
        });

        test('should call next with error when level not found', async () => {
            req.params.levelId = '999';
            const error = new Error(MESSAGES.LEVEL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;

            LevelService.deleteLevel = jest.fn().mockRejectedValue(error);

            await LevelController.deleteLevel(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('Controller layer responsibility', () => {
        test('should not contain business logic', async () => {
            const mockLevels = [];
            LevelService.getAllLevels = jest.fn().mockResolvedValue(mockLevels);

            await LevelController.getAllLevels(req, res, next);

            // Controller should only call service and format response
            expect(LevelService.getAllLevels).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });
    });
});
