const Joi = require("joi");
module.exports = {
  createCourseKeys: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "اسم الدورة مطلوب",
      "string.empty": "يجب ألا يكون اسم الدورة فارغًا",
    }),
    instructor: Joi.string().required().messages({
      "any.required": "اسم المحاضر مطلوب",
      "string.empty": "يجب ألا يكون اسم المحاضر فارغًا",
    }),
    price: Joi.number().required().messages({
      "any.required": "سعر الدورة مطلوب",
      "number.base": "يجب أن يكون سعر الدورة رقمًا",
    }),
    description: Joi.string().required().messages({
      "any.required": "وصف الدورة مطلوب",
      "string.empty": "يجب ألا يكون وصف الدورة فارغًا",
    }),
    courseSubTitle: Joi.string().required().messages({
      "any.required": "الوصف مصغر مطلوب",
      "string.empty": "يجب ألا يكون وصف الدورة فارغًا",
    }),
    Suggestion:Joi.boolean(),
    category: Joi.string().required().messages({
      'any.required': 'Category is required.',
      'string.empty': 'Category cannot be empty.',
    }),
    whatUWillLearn: Joi.array().items(Joi.string()).messages({
      "array.base": "يجب أن يكون مصفوفة",
    }),
    image: Joi.string(),
    link: Joi.string(),
    level: Joi.string().valid("beginner", "intermediate", "advanced").messages({
      "any.only": "يجب أن يكون مستوى الدورة beginner أو intermediate أو advanced",
    }),
    duration: Joi.object({
      value: Joi.number().required().messages({
        "any.required": "مدة الدورة مطلوبة",
        "number.base": "يجب أن يكون مدة الدورة رقمًا",
      }),
      unit: Joi.string().valid("days", "hours").required().messages({
        "any.required": "وحدة المدة مطلوبة",
        "any.only": "يجب أن تكون وحدة المدة days أو hours",
      }),
    }).required().messages({
      "any.required": "مدة الدورة مطلوبة",
    }),
  }),
  updateCourseKeys: Joi.object({
    name: Joi.string().messages({
      "string.empty": "يجب ألا يكون اسم الدورة فارغًا",
    }),
    price: Joi.number().messages({
      "number.base": "يجب أن يكون سعر الدورة رقمًا",
    }),
    Suggestion:Joi.boolean(),
    category: Joi.string().messages({
      'string.empty': 'Category cannot be empty.',
    }),
    instructor: Joi.string().messages({
      "string.empty": "يجب ألا يكون اسم المحاضر فارغًا",
    }),
    description: Joi.string().messages({
      "string.empty": "يجب ألا يكون وصف الدورة فارغًا",
    }),
    whatUWillLearn: Joi.array().items(Joi.string()).messages({
      "array.base": "يجب أن يكون مصفوفة",
    }),
    courseSubTitle: Joi.string().messages({
  
      "string.empty": "يجب ألا يكون وصف الدورة المصغر فارغًا",
    }),
    image: Joi.string(),
    link: Joi.string(),
    level: Joi.string().valid("beginner", "intermediate", "advanced").messages({
      "any.only": "يجب أن يكون مستوى الدورة beginner أو intermediate أو advanced",
    }),
    duration: Joi.object({
      value: Joi.number().required().messages({
        "any.required": "مدة الدورة مطلوبة",
        "number.base": "يجب أن يكون مدة الدورة رقمًا",
      }),
      unit: Joi.string().valid("days", "hours").required().messages({
        "any.required": "وحدة المدة مطلوبة",
        "any.only": "يجب أن تكون وحدة المدة days أو hours",
      }),
    }).required().messages({
      "any.required": "مدة الدورة مطلوبة",
    }),
  }),
};
