const Joi = require('joi');
module.exports = {
    fileValidationSchema: Joi.object({
        name: Joi.string()
            .required()
            .messages({
                'string.base': 'File name must be a string.',
                'string.empty': 'File name cannot be empty.',
                'any.required': 'File name is required.'
            }),
        path: Joi.string()
            .required()
            .messages({
                'string.base': 'File path must be a string.',
                'string.empty': 'File path cannot be empty.',
                'any.required': 'File path is required.'
            }),

    }),
    projectKeys: Joi.object({
        name: Joi.string()
            .required()
            .trim()
            .messages({
                'string.base': 'Project name must be a string.',
                'string.empty': 'Project name cannot be empty.',
                'any.required': 'Project name is required.'
            }),
        description: Joi.string()
            .allow('')
            .trim().
            required()
            .messages({
                'any.required': 'Project description must be a valid project name',
                'string.base': 'Description must be a string.'
            }),
    }).messages({
        'object.base': 'Data must be an object.'
    })
}
