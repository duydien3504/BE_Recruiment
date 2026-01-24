const Joi = require('joi');
const MESSAGES = require('../constant/messages');
const { ROLES } = require('../constant/roles');

const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': MESSAGES.EMAIL_INVALID,
            'any.required': MESSAGES.EMAIL_REQUIRED,
            'string.empty': MESSAGES.EMAIL_REQUIRED
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.min': MESSAGES.PASSWORD_MIN_LENGTH,
            'string.pattern.base': MESSAGES.PASSWORD_PATTERN,
            'any.required': MESSAGES.PASSWORD_REQUIRED,
            'string.empty': MESSAGES.PASSWORD_REQUIRED
        }),

    full_name: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': MESSAGES.FULL_NAME_REQUIRED,
            'string.empty': MESSAGES.FULL_NAME_REQUIRED
        }),

    role_id: Joi.number()
        .valid(ROLES.EMPLOYER, ROLES.CANDIDATE)
        .default(ROLES.CANDIDATE)
        .messages({
            'any.only': MESSAGES.INVALID_ROLE,
            'number.base': MESSAGES.INVALID_ROLE
        })
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: {
                    code: 400,
                    message: errors[0]
                }
            });
        }

        req.body = value;
        next();
    };
};

module.exports = {
    validateRegister: validate(registerSchema)
};
