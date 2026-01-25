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

const updateProfileSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .optional()
        .messages({
            'string.empty': MESSAGES.FULL_NAME_REQUIRED,
            'string.min': 'Họ tên phải có ít nhất 1 ký tự.',
            'string.max': 'Họ tên không được vượt quá 100 ký tự.'
        }),
    phone: Joi.string()
        .pattern(/^(0|\\+84)(3|5|7|8|9)[0-9]{8}$/)
        .optional()
        .messages({
            'string.pattern.base': MESSAGES.PHONE_INVALID
        }),
    address: Joi.string()
        .trim()
        .max(255)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Địa chỉ không được vượt quá 255 ký tự.'
        }),
    bio: Joi.string()
        .trim()
        .max(500)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Bio không được vượt quá 500 ký tự.'
        }),
    dateOfBirth: Joi.string()
        .isoDate()
        .optional()
        .messages({
            'string.isoDate': 'Ngày sinh không đúng định dạng (YYYY-MM-DD).'
        }),
    gender: Joi.string()
        .valid('male', 'female', 'other')
        .optional()
        .messages({
            'any.only': 'Giới tính phải là male, female hoặc other.'
        }),
    avatar: Joi.string()
        .uri()
        .optional()
        .allow('')
        .messages({
            'string.uri': 'Avatar phải là URL hợp lệ.'
        })
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .messages({
            'any.required': MESSAGES.OLD_PASSWORD_REQUIRED,
            'string.empty': MESSAGES.OLD_PASSWORD_REQUIRED
        }),
    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'any.required': MESSAGES.NEW_PASSWORD_REQUIRED,
            'string.empty': MESSAGES.NEW_PASSWORD_REQUIRED,
            'string.min': MESSAGES.PASSWORD_MIN_LENGTH,
            'string.pattern.base': MESSAGES.PASSWORD_PATTERN
        })
});

const addSkillsSchema = Joi.object({
    skillIds: Joi.array()
        .items(Joi.number().integer().min(1))
        .min(1)
        .unique()
        .required()
        .messages({
            'any.required': MESSAGES.SKILL_IDS_REQUIRED,
            'array.base': 'Skill IDs phải là một mảng.',
            'array.min': 'Phải chọn ít nhất một kỹ năng.',
            'array.unique': 'Các kỹ năng không được trùng lặp.',
            'number.base': 'ID kỹ năng phải là số.',
            'number.integer': 'ID kỹ năng phải là số nguyên.',
            'number.min': 'ID kỹ năng không hợp lệ.'
        })
});

const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params, { abortEarly: false });

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

const deleteSkillSchema = Joi.object({
    skillId: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'any.required': 'Skill ID là bắt buộc.',
            'number.base': 'Skill ID phải là số.',
            'number.integer': 'Skill ID phải là số nguyên.',
            'number.min': 'Skill ID không hợp lệ.'
        })
});

const upgradeEmployerSchema = Joi.object({
    tax_code: Joi.string()
        .required()
        .messages({
            'any.required': MESSAGES.TAX_CODE_REQUIRED,
            'string.empty': MESSAGES.TAX_CODE_REQUIRED
        }),
    company_name: Joi.string()
        .required()
        .messages({
            'any.required': MESSAGES.COMPANY_NAME_REQUIRED,
            'string.empty': MESSAGES.COMPANY_NAME_REQUIRED
        }),
    address: Joi.string()
        .optional()
        .allow(''),
    phone: Joi.string()
        .pattern(/^0(3|5|7|8|9)[0-9]{8}$/)
        .optional()
        .allow('')
        .messages({
            'string.pattern.base': MESSAGES.PHONE_INVALID
        })
});

module.exports = {
    validateUpdateProfile: validate(updateProfileSchema),
    validateChangePassword: validate(changePasswordSchema),
    validateAddSkills: validate(addSkillsSchema),
    validateDeleteSkill: validateParams(deleteSkillSchema),
    validateUpgradeEmployer: validate(upgradeEmployerSchema)
};
