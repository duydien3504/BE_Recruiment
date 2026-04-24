const Joi = require('joi');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

const cvBuilderSchemas = {
    updateDraft: Joi.object({
        templateId: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': MESSAGES.TEMPLATE_ID_REQUIRED,
                'any.required': MESSAGES.TEMPLATE_ID_REQUIRED
            }),
        
        themeConfig: Joi.object()
            .required()
            .messages({
                'object.base': MESSAGES.THEME_CONFIG_REQUIRED,
                'any.required': MESSAGES.THEME_CONFIG_REQUIRED
            }),

        cvData: Joi.object()
            .required()
            .messages({
                'object.base': MESSAGES.CVDATA_REQUIRED,
                'any.required': MESSAGES.CVDATA_REQUIRED
            }),

        // columnLayout là optional — FE gửi kèm để lưu cấu trúc cột 1/2 cột
        columnLayout: Joi.object().optional()
    }),
    aiSuggest: Joi.object({
        industry: Joi.string().trim().required().messages({
            'string.empty': MESSAGES.AI_SUGGESTION_PAYLOAD_INVALID,
            'any.required': MESSAGES.AI_SUGGESTION_PAYLOAD_INVALID
        }),
        section: Joi.string().trim().required().messages({
            'string.empty': MESSAGES.AI_SUGGESTION_PAYLOAD_INVALID,
            'any.required': MESSAGES.AI_SUGGESTION_PAYLOAD_INVALID
        }),
        currentText: Joi.string().trim().allow(null, '').optional(),
        keyword: Joi.string().trim().allow(null, '').optional()
    }),
    atsCheck: Joi.object({
        cvText: Joi.string().trim().required().messages({
            'string.empty': MESSAGES.ATS_PAYLOAD_INVALID,
            'any.required': MESSAGES.ATS_PAYLOAD_INVALID
        }),
        jdText: Joi.string().trim().required().messages({
            'string.empty': MESSAGES.ATS_PAYLOAD_INVALID,
            'any.required': MESSAGES.ATS_PAYLOAD_INVALID
        })
    })
};

const validateUpdateDraft = (req, res, next) => {
    const { error } = cvBuilderSchemas.updateDraft.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: errors[0],
            errors
        });
    }

    next();
};

const validateAiSuggest = (req, res, next) => {
    const { error } = cvBuilderSchemas.aiSuggest.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: errors[0],
            errors
        });
    }

    next();
};

const validateAtsCheck = (req, res, next) => {
    const { error } = cvBuilderSchemas.atsCheck.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: errors[0],
            errors
        });
    }

    next();
};

module.exports = {
    validateUpdateDraft,
    validateAiSuggest,
    validateAtsCheck
};
