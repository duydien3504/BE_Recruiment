const Joi = require('joi');
const { ROLES } = require('../constant/roles');

const updateJobSchema = Joi.object({
    title: Joi.string()
        .min(10)
        .max(200)
        .optional()
        .messages({
            'string.min': 'Tiêu đề phải có ít nhất 10 ký tự.',
            'string.max': 'Tiêu đề không được vượt quá 200 ký tự.'
        }),

    description: Joi.string()
        .min(30)
        .optional()
        .messages({
            'string.min': 'Mô tả công việc phải có ít nhất 30 ký tự.'
        }),

    requirements: Joi.string()
        .optional(),

    category_id: Joi.number()
        .integer()
        .positive()
        .optional(),

    location_id: Joi.number()
        .integer()
        .positive()
        .optional(),

    level_id: Joi.number()
        .integer()
        .positive()
        .optional(),

    salary_min: Joi.number()
        .min(0)
        .optional(),

    salary_max: Joi.number()
        .min(0)
        .optional()
        .messages({
            'number.min': 'Lương tối đa phải là số dương.'
        })
});

const updateJobStatusSchema = Joi.object({
    status: Joi.string()
        .valid('Active', 'Closed')
        .required()
        .messages({
            'any.only': 'Trạng thái chỉ có thể là Active hoặc Closed.',
            'any.required': 'Trạng thái là bắt buộc.'
        })
});

const validateUpdateJobStatus = (req, res, next) => {
    const { error } = updateJobStatusSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: 'Dữ liệu không hợp lệ.',
            errors
        });
    }
    next();
};

const validateUpdateJob = (req, res, next) => {
    const { error } = updateJobSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: 'Dữ liệu không hợp lệ.',
            errors
        });
    }
    next();
};

const rejectJobSchema = Joi.object({
    reason: Joi.string()
        .required()
        .min(5)
        .messages({
            'any.required': 'Lý do từ chối là bắt buộc.',
            'string.min': 'Lý do từ chối phải có ít nhất 5 ký tự.'
        })
});

const validateRejectJob = (req, res, next) => {
    const { error } = rejectJobSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            message: 'Dữ liệu không hợp lệ.',
            errors
        });
    }
    next();
};

module.exports = {
    validateUpdateJob,
    validateUpdateJobStatus,
    validateRejectJob
};
