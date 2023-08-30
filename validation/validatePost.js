const Joi = require("joi");

const validatePost = (_reqBody) => {
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
    userId: Joi.string().required(),
  });

  return joiSchema.validate(_reqBody);
};

module.exports = { validatePost };
