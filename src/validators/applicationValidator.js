const Joi = require('joi');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const { APPLICATION_STATUSES, PAGINATION_DEFAULTS } = require('../constant/applicationConstants');

/**
 * Schema validate path param applicationId cho cancel application.
 * Đảm bảo applicationId là số nguyên dương (BIGINT compatible).
 * Complexity: O(1) - Joi built-in parse, không có vòng lặp.
 */
const cancelApplicationParamSchema = Joi.object({
    applicationId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': MESSAGES.APPLICATION_ID_INVALID,
            'number.integer': MESSAGES.APPLICATION_ID_INVALID,
            'number.positive': MESSAGES.APPLICATION_ID_INVALID,
            'any.required': MESSAGES.APPLICATION_ID_INVALID
        })
});

/**
 * Schema validate query params cho GET /api/v1/candidate/applications/my-applications
 * - status: optional, phải nằm trong APPLICATION_STATUSES enum (O(1) lookup via Joi .valid())
 * - page: optional integer >= 1, default = PAGINATION_DEFAULTS.PAGE
 * - limit: optional integer > 0, default = PAGINATION_DEFAULTS.LIMIT
 * Complexity: O(1) - Joi built-in parse.
 */
const myApplicationsQuerySchema = Joi.object({
    status: Joi.string()
        .valid(...APPLICATION_STATUSES)
        .optional()
        .messages({
            'any.only': MESSAGES.APPLICATION_STATUS_INVALID
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(PAGINATION_DEFAULTS.PAGE)
        .optional()
        .messages({
            'number.base': MESSAGES.PAGINATION_PAGE_INVALID,
            'number.integer': MESSAGES.PAGINATION_PAGE_INVALID,
            'number.min': MESSAGES.PAGINATION_PAGE_INVALID
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .default(PAGINATION_DEFAULTS.LIMIT)
        .optional()
        .messages({
            'number.base': MESSAGES.PAGINATION_LIMIT_INVALID,
            'number.integer': MESSAGES.PAGINATION_LIMIT_INVALID,
            'number.min': MESSAGES.PAGINATION_LIMIT_INVALID
        })
});

/**
 * Middleware validate path params cho DELETE /api/v1/candidate/applications/:applicationId
 * Sử dụng Joi để tránh if-else validation thủ công (theo RULE.md).
 * Trả về structured error object với errorCode + httpStatus + message.
 */
const validateCancelApplicationParam = (req, res, next) => {
    const { error, value } = cancelApplicationParamSchema.validate(
        { applicationId: Number(req.params.applicationId) },
        { abortEarly: true }
    );

    if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                code: HTTP_STATUS.BAD_REQUEST,
                message: error.details[0].message
            }
        });
    }

    req.validatedParams = value;
    next();
};

/**
 * Middleware validate query params cho GET my-applications.
 * Gắn giá trị đã validate (kèm default) vào req.validatedQuery để Service dùng.
 */
const validateMyApplicationsQuery = (req, res, next) => {
    const { error, value } = myApplicationsQuerySchema.validate(req.query, {
        abortEarly: true,
        convert: true
    });

    if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                code: HTTP_STATUS.BAD_REQUEST,
                message: error.details[0].message
            }
        });
    }

    req.validatedQuery = value;
    next();
};

module.exports = {
    validateCancelApplicationParam,
    validateMyApplicationsQuery
};

