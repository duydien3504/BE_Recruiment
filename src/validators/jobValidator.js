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
        }),
        
    job_type: Joi.string()
        .valid('fulltime', 'parttime', 'remote')
        .optional()
        .messages({
            'any.only': 'Loại công việc chỉ có thể là fulltime, parttime, hoặc remote.'
        }),

    experience_required: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Yêu cầu kinh nghiệm không được vượt quá 100 ký tự.'
        }),

    quantity: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            'number.base': 'Số lượng tuyển dụng phải là số nguyên.',
            'number.min': 'Số lượng tuyển dụng tối thiểu là 1.'
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

const createJobSchema = Joi.object({
    title: Joi.string().min(10).max(200).required().messages({
        'any.required': 'Tiêu đề là bắt buộc.',
        'string.empty': 'Tiêu đề không được để trống.',
        'string.min': 'Tiêu đề phải có ít nhất 10 ký tự.',
        'string.max': 'Tiêu đề không được vượt quá 200 ký tự.'
    }),
    description: Joi.string().min(30).required().messages({
        'any.required': 'Mô tả là bắt buộc.',
        'string.empty': 'Mô tả không được để trống.',
        'string.min': 'Mô tả công việc phải có ít nhất 30 ký tự.'
    }),
    requirements: Joi.string().optional(),
    category_id: Joi.number().integer().positive().required().messages({
        'any.required': 'ID danh mục là bắt buộc.'
    }),
    location_id: Joi.number().integer().positive().required().messages({
        'any.required': 'ID địa điểm là bắt buộc.'
    }),
    level_id: Joi.number().integer().positive().optional(),
    salary_min: Joi.number().min(0).optional(),
    salary_max: Joi.number().min(0).optional().messages({
        'number.min': 'Lương tối đa phải là số dương.'
    }),
    job_type: Joi.string().valid('fulltime', 'parttime', 'remote').required().messages({
        'any.only': 'Loại công việc chỉ có thể là fulltime, parttime, hoặc remote.',
        'any.required': 'Loại công việc là bắt buộc.'
    }),
    experience_required: Joi.string().max(100).required().messages({
        'any.required': 'Yêu cầu kinh nghiệm là bắt buộc.',
        'string.max': 'Yêu cầu kinh nghiệm không được vượt quá 100 ký tự.'
    }),
    quantity: Joi.number().integer().min(1).optional().default(1).messages({
        'number.base': 'Số lượng tuyển dụng phải là số nguyên.',
        'number.min': 'Số lượng tuyển dụng tối thiểu là 1.'
    })
});

const validateCreateJob = (req, res, next) => {
    const { error, value } = createJobSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors });
    }
    req.body = value;
    next();
};

module.exports = {
    validateCreateJob,
    validateUpdateJob,
    validateUpdateJobStatus,
    validateRejectJob
};
