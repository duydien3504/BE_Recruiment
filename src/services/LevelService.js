const LevelRepository = require('../repositories/LevelRepository');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class LevelService {
    /**
     * Get all levels
     * Complexity: O(n) where n = number of levels (typically small, ~10-20 items)
     * @returns {Promise<Array>} List of levels
     */
    async getAllLevels() {
        const levels = await LevelRepository.findAllActive();

        return levels.map(level => ({
            levelId: level.levelId,
            name: level.name,
            createdAt: level.created_at || level.createdAt
        }));
    }

    /**
     * Get level by ID
     * Complexity: O(1) - Primary key lookup
     * @param {number} levelId - Level ID
     * @returns {Promise<Object>} Level details
     */
    async getLevelById(levelId) {
        const level = await LevelRepository.findById(levelId);

        if (!level) {
            const error = new Error(MESSAGES.LEVEL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        return {
            levelId: level.levelId,
            name: level.name,
            createdAt: level.created_at || level.createdAt
        };
    }

    /**
     * Create new level
     * Complexity: O(1) - Single insert + unique check
     * @param {Object} levelData - Level data {name}
     * @returns {Promise<Object>} Created level
     */
    async createLevel(levelData) {
        const { name } = levelData;

        // Check if level name already exists
        const existingLevel = await LevelRepository.findByName(name);
        if (existingLevel) {
            const error = new Error(MESSAGES.LEVEL_NAME_EXISTS);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const newLevel = await LevelRepository.create({ name });

        return {
            levelId: newLevel.levelId,
            name: newLevel.name,
            createdAt: newLevel.created_at || newLevel.createdAt
        };
    }

    /**
     * Update level
     * Complexity: O(1) - Primary key lookup + update + unique check
     * @param {number} levelId - Level ID
     * @param {Object} levelData - Level data {name}
     * @returns {Promise<Object>} Updated level
     */
    async updateLevel(levelId, levelData) {
        const { name } = levelData;

        // Check if level exists
        const level = await LevelRepository.findById(levelId);
        if (!level) {
            const error = new Error(MESSAGES.LEVEL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Check if new name already exists (excluding current level)
        if (name && name !== level.name) {
            const existingLevel = await LevelRepository.findByName(name);
            if (existingLevel && existingLevel.levelId !== levelId) {
                const error = new Error(MESSAGES.LEVEL_NAME_EXISTS);
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }
        }

        await LevelRepository.update(levelId, { name });

        const updatedLevel = await LevelRepository.findById(levelId);

        return {
            levelId: updatedLevel.levelId,
            name: updatedLevel.name,
            createdAt: updatedLevel.created_at || updatedLevel.createdAt
        };
    }

    /**
     * Delete level
     * Complexity: O(1) - Primary key lookup + delete
     * @param {number} levelId - Level ID
     * @returns {Promise<void>}
     */
    async deleteLevel(levelId) {
        const level = await LevelRepository.findById(levelId);

        if (!level) {
            const error = new Error(MESSAGES.LEVEL_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        await LevelRepository.delete(levelId);
    }
}

module.exports = new LevelService();


