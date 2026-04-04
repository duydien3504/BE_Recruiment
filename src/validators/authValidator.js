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
        }),
    date_of_birth: Joi.date().iso().optional()
        .messages({ 'date.format': 'Ngày sinh phải đúng định dạng ISO 8601 (YYYY-MM-DD)' }),
    gender: Joi.string().valid('male', 'female', 'other').optional()
        .messages({ 'any.only': 'Giới tính chỉ nhận male, female, hoặc other' })
});

const employerRegisterSchema = Joi.object({
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
    fullName: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': MESSAGES.FULL_NAME_REQUIRED,
            'string.empty': MESSAGES.FULL_NAME_REQUIRED
        }),
    companyName: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': MESSAGES.COMPANY_NAME_REQUIRED,
            'string.empty': MESSAGES.COMPANY_NAME_REQUIRED
        }),
    taxCode: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': MESSAGES.TAX_CODE_REQUIRED,
            'string.empty': MESSAGES.TAX_CODE_REQUIRED
        }),
    phoneNumber: Joi.string()
        .trim()
        .pattern(/^(0|\+84)[3-9]\d{8}$/)
        .optional()
        .messages({
            'string.pattern.base': MESSAGES.PHONE_INVALID
        }),
    date_of_birth: Joi.date().iso().optional()
        .messages({ 'date.format': 'Ngày sinh phải đúng định dạng ISO 8601 (YYYY-MM-DD)' }),
    gender: Joi.string().valid('male', 'female', 'other').optional()
        .messages({ 'any.only': 'Giới tính chỉ nhận male, female, hoặc other' })
});

const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const payload = source === 'query' ? req.query : req.body;
        const { error, value } = schema.validate(payload, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: {
                    code: 400,
                    message: errors[0]
                }
            });
        }

        if (source === 'query') {
            req.query = value;
        } else {
            req.body = value;
        }
        next();
    };
};

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': MESSAGES.EMAIL_INVALID,
            'any.required': MESSAGES.EMAIL_REQUIRED,
            'string.empty': MESSAGES.EMAIL_REQUIRED
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': MESSAGES.PASSWORD_REQUIRED,
            'string.empty': MESSAGES.PASSWORD_REQUIRED
        })
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': MESSAGES.EMAIL_INVALID,
            'any.required': MESSAGES.EMAIL_REQUIRED,
            'string.empty': MESSAGES.EMAIL_REQUIRED
        })
});

const verifyOtpSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': MESSAGES.EMAIL_INVALID,
            'any.required': MESSAGES.EMAIL_REQUIRED,
            'string.empty': MESSAGES.EMAIL_REQUIRED
        }),
    otp: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            'string.pattern.base': MESSAGES.OTP_PATTERN,
            'any.required': MESSAGES.OTP_REQUIRED,
            'string.empty': MESSAGES.OTP_REQUIRED
        })
});

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': MESSAGES.REFRESH_TOKEN_REQUIRED,
            'string.empty': MESSAGES.REFRESH_TOKEN_REQUIRED
        })
});

const employerPaymentCallbackSchema = Joi.object({
    vnp_ResponseCode: Joi.string().required(),
    vnp_TxnRef: Joi.string().required(),
    vnp_SecureHash: Joi.string().required()
}).unknown(true);

module.exports = {
    validateRegister: validate(registerSchema),
    validateEmployerRegister: validate(employerRegisterSchema),
    validateLogin: validate(loginSchema),
    validateForgotPassword: validate(forgotPasswordSchema),
    validateVerifyOtp: validate(verifyOtpSchema),
    validateRefreshToken: validate(refreshTokenSchema),
    validateEmployerPaymentCallback: validate(employerPaymentCallbackSchema, 'query')
};
