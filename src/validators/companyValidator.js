const Joi = require('joi');
const MESSAGES = require('../constant/messages');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details[0].message;
            return res.status(400).json({
                error: {
                    code: 400,
                    message: errorMessage
                }
            });
        }

        next();
    };
};

const updateCompanySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .optional()
        .messages({
            'string.empty': MESSAGES.COMPANY_NAME_REQUIRED,
            'string.min': 'Tên công ty phải có ít nhất 2 ký tự.',
            'string.max': 'Tên công ty không được vượt quá 255 ký tự.'
        }),
    phone_number: Joi.string()
        .pattern(/^0(3|5|7|8|9)[0-9]{8}$/)
        .optional()
        .allow('')
        .messages({
            'string.pattern.base': MESSAGES.PHONE_INVALID
        }),
    description: Joi.string()
        .optional()
        .allow(''),
    scale: Joi.string()
        .optional()
        .allow(''),
    website_url: Joi.string()
        .uri()
        .optional()
        .allow('')
        .messages({
            'string.uri': 'Website URL không hợp lệ.'
        }),
    address_detail: Joi.string()
        .optional()
        .allow(''),
    // Explicitly forbid tax_code update
    tax_code: Joi.any().forbidden().messages({
        'any.unknown': 'Không được phép cập nhật Mã số thuế.'
    })
});

module.exports = {
    validateUpdateCompany: validate(updateCompanySchema)
};
