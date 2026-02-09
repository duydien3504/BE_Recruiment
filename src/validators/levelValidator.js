const Joi = require('joi');
const MESSAGES = require('../constant/messages');

const levelSchemas = {
    create: Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(255)
            .required()
            .messages({
                'string.empty': MESSAGES.LEVEL_NAME_REQUIRED,
                'string.min': 'Tên cấp độ phải có ít nhất 1 ký tự.',
                'string.max': 'Tên cấp độ không được vượt quá 255 ký tự.',
                'any.required': MESSAGES.LEVEL_NAME_REQUIRED
            })
    }),

    update: Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(255)
            .required()
            .messages({
                'string.empty': MESSAGES.LEVEL_NAME_REQUIRED,
                'string.min': 'Tên cấp độ phải có ít nhất 1 ký tự.',
                'string.max': 'Tên cấp độ không được vượt quá 255 ký tự.',
                'any.required': MESSAGES.LEVEL_NAME_REQUIRED
            })
    }),

    levelId: Joi.object({
        levelId: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'ID cấp độ phải là số.',
                'number.integer': 'ID cấp độ phải là số nguyên.',
                'number.positive': 'ID cấp độ phải là số dương.',
                'any.required': 'ID cấp độ là bắt buộc.'
            })
    })
};

const validateCreateLevel = (req, res, next) => {
    const { error } = levelSchemas.create.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: errors[0],
            errors
        });
    }

    next();
};

const validateUpdateLevel = (req, res, next) => {
    const { error } = levelSchemas.update.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: errors[0],
            errors
        });
    }

    next();
};

const validateLevelId = (req, res, next) => {
    const { error } = levelSchemas.levelId.validate(
        { levelId: parseInt(req.params.levelId) },
        { abortEarly: false }
    );

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: errors[0],
            errors
        });
    }

    next();
};

module.exports = {
    validateCreateLevel,
    validateUpdateLevel,
    validateLevelId
};
