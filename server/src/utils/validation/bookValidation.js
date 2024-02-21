const Joi = require('joi');
module.exports={
createBookKeys : Joi.object({
    title: Joi.string().required().messages({
      'any.required': 'Title is required.',
      'string.empty': 'Title cannot be empty.',
    }),
    rate: Joi.number().required().messages({
      'any.required': 'Rate is required.',
      'number.base': 'Rate must be a number.',
    }),
    category: Joi.string().required().messages({
      'any.required': 'Category is required.',
      'string.empty': 'Category cannot be empty.',
    }),
    author: Joi.string().required().messages({
      'any.required': 'Author is required.',
      'string.empty': 'Author cannot be empty.',
    }),
    Suggestion:Joi.boolean(),
    downloads: Joi.number().default(0),
    description: Joi.string(),
    file: Joi.string(),
    coverImage: Joi.string(),
  }),
  updateBookKeys : Joi.object({
    title: Joi.string().required().messages({
      'any.required': 'Title is required.',
      'string.empty': 'Title cannot be empty.',
    }),
    Suggestion:Joi.boolean(),
    category: Joi.string().required().messages({
      'any.required': 'Category is required.',
      'string.empty': 'Category cannot be empty.',
    }),
    author: Joi.string().required().messages({
      'any.required': 'Author is required.',
      'string.empty': 'Author cannot be empty.',
    }),
    downloads: Joi.number().default(0),
    description: Joi.string(),
    file: Joi.string(),
    coverImage: Joi.string(),
  }),
}
     