const SkillService = require('../services/SkillService');
const HTTP_STATUS = require('../constant/statusCode');
const MESSAGES = require('../constant/messages');
const Joi = require('joi');

class SkillController {
    /**
     * Get all skills
     * @route GET /api/v1/skills
     */
    async getAllSkills(req, res, next) {
        try {
            const skills = await SkillService.getAllSkills();
            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_SKILLS_SUCCESS,
                data: skills
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create skill (Admin)
     * @route POST /api/v1/admin/skills
     */
    async createSkill(req, res, next) {
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

            const skill = await SkillService.createSkill(req.body);

            return res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.CREATE_SKILL_SUCCESS,
                data: skill
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update skill (Admin)
     * @route PUT /api/v1/admin/skills/:id
     */
    async updateSkill(req, res, next) {
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
            const updatedSkill = await SkillService.updateSkill(id, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_SKILL_SUCCESS,
                data: updatedSkill
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete skill (Admin)
     * @route DELETE /api/v1/admin/skills/:id
     */
    async deleteSkill(req, res, next) {
        try {
            const { id } = req.params;
            await SkillService.deleteSkill(id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.DELETE_SKILL_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SkillController();
