const LevelService = require('../services/LevelService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class LevelController {
    /**
     * Get all levels
     * @route GET /api/v1/levels
     * @access Public
     */
    async getAllLevels(req, res, next) {
        try {
            const levels = await LevelService.getAllLevels();

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_LEVELS_SUCCESS,
                data: levels
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get level by ID
     * @route GET /api/v1/levels/:levelId
     * @access Public
     */
    async getLevelById(req, res, next) {
        try {
            const { levelId } = req.params;
            const level = await LevelService.getLevelById(parseInt(levelId));

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_LEVEL_SUCCESS,
                data: level
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new level
     * @route POST /api/v1/levels
     * @access Admin only
     */
    async createLevel(req, res, next) {
        try {
            const level = await LevelService.createLevel(req.body);

            res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.CREATE_LEVEL_SUCCESS,
                data: level
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update level
     * @route PUT /api/v1/levels/:levelId
     * @access Admin only
     */
    async updateLevel(req, res, next) {
        try {
            const { levelId } = req.params;
            const level = await LevelService.updateLevel(parseInt(levelId), req.body);

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_LEVEL_SUCCESS,
                data: level
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete level
     * @route DELETE /api/v1/levels/:levelId
     * @access Admin only
     */
    async deleteLevel(req, res, next) {
        try {
            const { levelId } = req.params;
            await LevelService.deleteLevel(parseInt(levelId));

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.DELETE_LEVEL_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LevelController();
