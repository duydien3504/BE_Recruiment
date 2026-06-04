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

        cvData: Joi.object({
            // ── Các section chuẩn (tất cả optional để linh hoạt) ──────────────
            personal:    Joi.object().optional(),
            about:       Joi.string().max(3000).allow('').optional(),
            experience:  Joi.array().optional(),
            education:   Joi.array().optional(),
            skills:      Joi.alternatives().try(Joi.object(), Joi.array(), Joi.string()).optional(),
            projects:    Joi.array().optional(),
            contact:     Joi.object().optional(),
            certifications: Joi.array().optional(),
            languages:   Joi.array().optional(),
            awards:      Joi.array().optional(),

            // ── Mục tùy chỉnh ─────────────────────────────────────────────────
            customSections: Joi.array().items(
                Joi.object({
                    id:    Joi.string().required(),
                    title: Joi.string().max(50).required(),
                    icon:  Joi.string()
                               .valid('award','star','bookmark','heart',
                                      'globe','tool','book','users','zap','default')
                               .default('default'),
                    items: Joi.array().items(
                        Joi.object({
                            id:          Joi.string().required(),
                            name:        Joi.string().max(200).required(),
                            subtitle:    Joi.string().max(200).allow('').optional(),
                            startDate:   Joi.string().pattern(/^\d{4}-\d{2}$/).allow('').optional(),
                            endDate:     Joi.string().pattern(/^\d{4}-\d{2}$/).allow('').optional(),
                            description: Joi.string().max(2000).allow('').optional()
                        })
                    ).default([])
                })
            ).optional()
        })
        .unknown(true)          // cho phép các field khác pass through
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
