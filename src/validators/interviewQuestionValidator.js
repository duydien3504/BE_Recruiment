const Joi = require('joi');
const HTTP_STATUS = require('../constant/statusCode');

const generateQuestionsSchema = Joi.object({
    applicationId: Joi.number().integer().positive().required().messages({
        'number.base': 'Application ID invalid',
        'number.integer': 'Application ID invalid',
        'number.positive': 'Application ID invalid',
        'any.required': 'Application ID required'
    }),
    force_regenerate: Joi.boolean().default(false).messages({
        'boolean.base': 'force_regenerate must be a boolean'
    })
});

const validateGenerateQuestions = (req, res, next) => {
    const { error, value } = generateQuestionsSchema.validate(
        { 
            applicationId: Number(req.params.applicationId),
            force_regenerate: req.body?.force_regenerate
        },
        { abortEarly: true, convert: true }
    );

    if (error) {
        return res.status(HTTP_STATUS?.BAD_REQUEST || 400).json({
            success: false,
            error: {
                code: HTTP_STATUS?.BAD_REQUEST || 400,
                message: error.details[0].message
            }
        });
    }

    req.validatedParams = value;
    next();
};

module.exports = {
    validateGenerateQuestions
};
