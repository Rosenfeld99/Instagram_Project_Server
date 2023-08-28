const Joi = require("joi");

const validateGrid = (_reqBody) => {
  const joiSchema = Joi.object({
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri(),
        alt: Joi.string().allow(null || ""),
      })
    ),
    description: Joi.string().allow(null || ""),
    comments: Joi.array()
      .items(Joi.string())
      .allow(null || ""),
    likes: Joi.array()
      .items(Joi.string())
      .allow(null || ""),
  });

  return joiSchema.validate(_reqBody);
};

module.exports = { validateGrid };
