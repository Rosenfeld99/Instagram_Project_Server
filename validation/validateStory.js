const Joi = require("joi");

const validateStory = (_reqBody) => {
  const joiSchema = Joi.object({
    url: Joi.string().required(),
    alt: Joi.string().allow(null || ""),
    created: Joi.date().required(),
  });

  return joiSchema.validate(_reqBody);
};

module.exports = { validateStory };
